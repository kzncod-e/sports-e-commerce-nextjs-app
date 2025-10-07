import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { order, orderItem, product } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'cancelled'], {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid status value'
  })
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const orderId = params.id;
    if (!orderId || isNaN(parseInt(orderId))) {
      return NextResponse.json(
        { success: false, message: 'Valid order ID is required' },
        { status: 400 }
      );
    }

    const orderResult = await db
      .select()
      .from(order)
      .where(and(eq(order.id, parseInt(orderId)), eq(order.userId, userId)))
      .limit(1);

    if (orderResult.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const orderRecord = orderResult[0];

    const orderItems = await db
      .select()
      .from(orderItem)
      .leftJoin(product, eq(orderItem.productId, product.id))
      .where(eq(orderItem.orderId, parseInt(orderId)));

    const items = orderItems.map((item) => ({
      orderItem: item.order_item,
      product: item.product,
      subtotal: item.order_item.price * item.order_item.quantity
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          order: orderRecord,
          items
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET order error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const orderId = params.id;
    if (!orderId || isNaN(parseInt(orderId))) {
      return NextResponse.json(
        { success: false, message: 'Valid order ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = updateStatusSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { status: newStatus } = validationResult.data;

    const orderResult = await db
      .select()
      .from(order)
      .where(and(eq(order.id, parseInt(orderId)), eq(order.userId, userId)))
      .limit(1);

    if (orderResult.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const currentOrder = orderResult[0];
    const oldStatus = currentOrder.status;

    const shouldRestoreStock =
      newStatus === 'cancelled' &&
      (oldStatus === 'pending' || oldStatus === 'processing');

    if (shouldRestoreStock) {
      const items = await db
        .select()
        .from(orderItem)
        .where(eq(orderItem.orderId, parseInt(orderId)));

      for (const item of items) {
        await db
          .update(product)
          .set({
            stock: (await db
              .select({ stock: product.stock })
              .from(product)
              .where(eq(product.id, item.productId))
              .limit(1)
              .then(res => res[0]?.stock || 0)) + item.quantity
          })
          .where(eq(product.id, item.productId));
      }
    }

    const updatedOrder = await db
      .update(order)
      .set({
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
      .where(and(eq(order.id, parseInt(orderId)), eq(order.userId, userId)))
      .returning();

    if (updatedOrder.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order status updated',
        data: updatedOrder[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT order error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}