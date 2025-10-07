import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { order, orderItem, product, cart, cartItem } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

const createOrderSchema = z.object({
  shippingAddress: z.string().min(10, 'Shipping address must be at least 10 characters'),
});

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const orders = await db
      .select()
      .from(order)
      .where(eq(order.userId, userId))
      .orderBy(desc(order.createdAt));

    const ordersWithItems = await Promise.all(
      orders.map(async (orderRecord) => {
        const items = await db
          .select({
            orderItem: orderItem,
            product: product,
          })
          .from(orderItem)
          .leftJoin(product, eq(orderItem.productId, product.id))
          .where(eq(orderItem.orderId, orderRecord.id));

        return {
          order: orderRecord,
          items: items,
          itemsCount: items.length,
        };
      })
    );

    return NextResponse.json(
      { success: true, data: ordersWithItems },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const validation = createOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { shippingAddress } = validation.data;

    const userCart = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);

    if (userCart.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart not found' },
        { status: 404 }
      );
    }

    const items = await db
      .select({
        cartItem: cartItem,
        product: product,
      })
      .from(cartItem)
      .leftJoin(product, eq(cartItem.productId, product.id))
      .where(eq(cartItem.cartId, userCart[0].id));

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty' },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!item.product) {
        return NextResponse.json(
          { success: false, message: 'Product not found' },
          { status: 400 }
        );
      }

      if (item.product.stock < item.cartItem.quantity) {
        return NextResponse.json(
          { success: false, message: `Product ${item.product.name} is out of stock` },
          { status: 400 }
        );
      }
    }

    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.product!.price * item.cartItem.quantity);
    }, 0);

    const timestamp = new Date().toISOString();

    const newOrder = await db
      .insert(order)
      .values({
        userId,
        totalAmount,
        status: 'pending',
        shippingAddress,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning();

    const createdOrder = newOrder[0];

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const newOrderItem = await db
          .insert(orderItem)
          .values({
            orderId: createdOrder.id,
            productId: item.cartItem.productId,
            quantity: item.cartItem.quantity,
            price: item.product!.price,
            createdAt: timestamp,
          })
          .returning();

        await db
          .update(product)
          .set({
            stock: item.product!.stock - item.cartItem.quantity,
          })
          .where(eq(product.id, item.cartItem.productId));

        return newOrderItem[0];
      })
    );

    await db
      .delete(cartItem)
      .where(eq(cartItem.cartId, userCart[0].id));

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        data: {
          order: createdOrder,
          items: orderItems,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST order error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}