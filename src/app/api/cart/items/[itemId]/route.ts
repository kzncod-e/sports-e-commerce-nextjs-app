import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cartItem, cart, product } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const updateQuantitySchema = z.object({
  quantity: z.number().int().positive().min(1, 'Quantity must be at least 1'),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    // Authentication check
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate itemId
    const itemId = parseInt(params.itemId);
    if (!itemId || isNaN(itemId)) {
      return NextResponse.json(
        { success: false, message: 'Valid item ID is required' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateQuantitySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: validationResult.error.errors[0].message 
        },
        { status: 400 }
      );
    }

    const { quantity } = validationResult.data;

    // Fetch cart item with cart information to verify ownership
    const existingCartItem = await db
      .select({
        cartItem: cartItem,
        cart: cart,
      })
      .from(cartItem)
      .innerJoin(cart, eq(cartItem.cartId, cart.id))
      .where(eq(cartItem.id, itemId))
      .limit(1);

    if (existingCartItem.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Verify cart belongs to authenticated user
    if (existingCartItem[0].cart.userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Fetch product to verify stock availability
    const productRecord = await db
      .select()
      .from(product)
      .where(eq(product.id, existingCartItem[0].cartItem.productId))
      .limit(1);

    if (productRecord.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Verify sufficient stock
    if (quantity > productRecord[0].stock) {
      return NextResponse.json(
        { success: false, message: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Update cart item quantity
    const updatedCartItem = await db
      .update(cartItem)
      .set({
        quantity,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(cartItem.id, itemId))
      .returning();

    // Update cart's updatedAt timestamp
    await db
      .update(cart)
      .set({
        updatedAt: new Date().toISOString(),
      })
      .where(eq(cart.id, existingCartItem[0].cartItem.cartId));

    return NextResponse.json(
      {
        success: true,
        message: 'Cart item updated',
        data: updatedCartItem[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    // Authentication check
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate itemId
    const itemId = parseInt(params.itemId);
    if (!itemId || isNaN(itemId)) {
      return NextResponse.json(
        { success: false, message: 'Valid item ID is required' },
        { status: 400 }
      );
    }

    // Fetch cart item with cart information to verify ownership
    const existingCartItem = await db
      .select({
        cartItem: cartItem,
        cart: cart,
      })
      .from(cartItem)
      .innerJoin(cart, eq(cartItem.cartId, cart.id))
      .where(eq(cartItem.id, itemId))
      .limit(1);

    if (existingCartItem.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Verify cart belongs to authenticated user
    if (existingCartItem[0].cart.userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Delete cart item
    await db
      .delete(cartItem)
      .where(eq(cartItem.id, itemId))
      .returning();

    // Update cart's updatedAt timestamp
    await db
      .update(cart)
      .set({
        updatedAt: new Date().toISOString(),
      })
      .where(eq(cart.id, existingCartItem[0].cartItem.cartId));

    return NextResponse.json(
      {
        success: true,
        message: 'Item removed from cart',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}