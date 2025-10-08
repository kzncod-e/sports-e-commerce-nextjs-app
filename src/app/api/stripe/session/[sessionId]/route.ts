import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Lazy initialization to prevent build-time errors
function getStripe() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(apiKey, {
    apiVersion: '2024-12-18.acacia',
  });
}

/**
 * GET /api/stripe/session/[sessionId]
 * Retrieve a Stripe checkout session
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: 'Stripe is not configured.',
        },
        { status: 500 }
      );
    }

    // Initialize Stripe only when needed
    const stripe = getStripe();

    // Retrieve the session with line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: session.id,
          amount_total: session.amount_total,
          currency: session.currency,
          customer_email: session.customer_details?.email,
          customer_name: session.customer_details?.name,
          payment_status: session.payment_status,
          status: session.status,
          line_items: session.line_items?.data.map((item) => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            amount_total: item.amount_total,
            currency: item.currency,
          })),
          shipping: session.shipping_details,
          created: session.created,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Stripe session retrieval error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to retrieve session',
      },
      { status: 500 }
    );
  }
}