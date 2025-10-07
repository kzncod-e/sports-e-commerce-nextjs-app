import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/db';
import { order } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Initialize Stripe lazily to avoid build-time errors
let stripe: Stripe | null = null;

function getStripe() {
  if (!stripe) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripe = new Stripe(apiKey, {
      apiVersion: '2024-12-18.acacia',
    });
  }
  return stripe;
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events for payment processing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { success: false, message: 'No signature provided' },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.warn('Stripe webhook secret not configured');
      return NextResponse.json(
        { success: false, message: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Get Stripe instance
    const stripeInstance = getStripe();

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripeInstance.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { success: false, message: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;

      case 'charge.refunded':
        const refund = event.data.object as Stripe.Charge;
        await handleRefund(refund);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true, received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) {
      console.warn('No orderId in payment intent metadata');
      return;
    }

    // Update order status to processing
    await db
      .update(order)
      .set({
        status: 'processing',
        paymentIntentId: paymentIntent.id,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(order.id, parseInt(orderId)));

    console.log(`Order ${orderId} payment succeeded`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;

    if (!orderId) {
      console.warn('No orderId in payment intent metadata');
      return;
    }

    // Update order status to cancelled
    await db
      .update(order)
      .set({
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(order.id, parseInt(orderId)));

    console.log(`Order ${orderId} payment failed`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

/**
 * Handle refund
 */
async function handleRefund(charge: Stripe.Charge) {
  try {
    const paymentIntentId = charge.payment_intent as string;

    if (!paymentIntentId) {
      console.warn('No payment intent ID in charge');
      return;
    }

    // Find order by payment intent ID
    const orders = await db
      .select()
      .from(order)
      .where(eq(order.paymentIntentId, paymentIntentId))
      .limit(1);

    if (orders.length === 0) {
      console.warn(`No order found for payment intent: ${paymentIntentId}`);
      return;
    }

    // Update order status to cancelled
    await db
      .update(order)
      .set({
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(order.id, orders[0].id));

    console.log(`Order ${orders[0].id} refunded`);
  } catch (error) {
    console.error('Error handling refund:', error);
  }
}