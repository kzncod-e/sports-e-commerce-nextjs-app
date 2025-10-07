import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/stripe/config
 * Get Stripe publishable key for client-side integration
 */
export async function GET(request: NextRequest) {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      return NextResponse.json(
        {
          success: false,
          message: 'Stripe publishable key not configured',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          publishableKey,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Stripe config error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to get Stripe configuration',
      },
      { status: 500 }
    );
  }
}