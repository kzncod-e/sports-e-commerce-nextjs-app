import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const createPaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('usd'),
  orderId: z.number().int('Order ID must be an integer').optional(),
  metadata: z.record(z.string()).optional(),
});

/**
 * POST /api/stripe/payment-intent
 * Create a Stripe payment intent for order processing
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.',
        },
        { status: 500 }
      );
    }

    // Authentication check
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createPaymentIntentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { amount, currency, orderId, metadata } = validation.data;

    // Convert amount to cents (Stripe expects amounts in smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        orderId: orderId?.toString() || '',
        ...metadata,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Stripe payment intent error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create payment intent',
      },
      { status: 500 }
    );
  }
}