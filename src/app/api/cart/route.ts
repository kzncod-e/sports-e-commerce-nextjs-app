import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cart, cartItem, product } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { z } from 'zod';

// GET - Get User's Cart
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: "Authentication required" 
      }, { status: 401 });
    }

    // Find or create cart for user
    let userCart = await db.select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);

    if (userCart.length === 0) {
      const now = new Date().toISOString();
      userCart = await db.insert(cart)
        .values({
          userId,
          createdAt: now,
          updatedAt: now
        })
        .returning();
    }

    const currentCart = userCart[0];

    // Fetch all cart items with product details
    const items = await db.select({
      cartItem: cartItem,
      product: product
    })
      .from(cartItem)
      .innerJoin(product, eq(cartItem.productId, product.id))
      .where(eq(cartItem.cartId, currentCart.id));

    // Calculate subtotals and total
    const itemsWithSubtotal = items.map(item => ({
      cartItem: item.cartItem,
      product: item.product,
      subtotal: item.product.price * item.cartItem.quantity
    }));

    const total = itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0);

    return NextResponse.json({
      success: true,
      data: {
        cart: currentCart,
        items: itemsWithSubtotal,
        total
      }
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

// POST - Add Item to Cart
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: "Authentication required" 
      }, { status: 401 });
    }

    const body = await request.json();

    // Validation schema
    const addItemSchema = z.object({
      productId: z.number().int({ message: "Product ID must be an integer" }),
      quantity: z.number().int().positive({ message: "Quantity must be a positive integer" }).default(1)
    });

    const validationResult = addItemSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        success: false,
        message: validationResult.error.errors[0].message
      }, { status: 400 });
    }

    const { productId, quantity } = validationResult.data;

    // Verify product exists and has sufficient stock
    const productData = await db.select()
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);

    if (productData.length === 0) {
      return NextResponse.json({ 
        success: false,
        message: "Product not found"
      }, { status: 404 });
    }

    const selectedProduct = productData[0];

    // Find or create cart for user
    let userCart = await db.select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);

    const now = new Date().toISOString();

    if (userCart.length === 0) {
      userCart = await db.insert(cart)
        .values({
          userId,
          createdAt: now,
          updatedAt: now
        })
        .returning();
    }

    const currentCart = userCart[0];

    // Check if item already exists in cart
    const existingItem = await db.select()
      .from(cartItem)
      .where(and(
        eq(cartItem.cartId, currentCart.id),
        eq(cartItem.productId, productId)
      ))
      .limit(1);

    let item;

    if (existingItem.length > 0) {
      // Item exists, update quantity
      const newQuantity = existingItem[0].quantity + quantity;

      // Validate stock availability
      if (selectedProduct.stock < newQuantity) {
        return NextResponse.json({ 
          success: false,
          message: "Insufficient stock"
        }, { status: 400 });
      }

      item = await db.update(cartItem)
        .set({
          quantity: newQuantity,
          updatedAt: now
        })
        .where(eq(cartItem.id, existingItem[0].id))
        .returning();

    } else {
      // Validate stock availability for new item
      if (selectedProduct.stock < quantity) {
        return NextResponse.json({ 
          success: false,
          message: "Insufficient stock"
        }, { status: 400 });
      }

      // Create new cart item
      item = await db.insert(cartItem)
        .values({
          cartId: currentCart.id,
          productId,
          quantity,
          createdAt: now,
          updatedAt: now
        })
        .returning();
    }

    // Update cart's updatedAt
    await db.update(cart)
      .set({ updatedAt: now })
      .where(eq(cart.id, currentCart.id));

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
      data: {
        cart: currentCart,
        item: item[0]
      }
    }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

// DELETE - Clear Entire Cart
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: "Authentication required" 
      }, { status: 401 });
    }

    // Find user's cart
    const userCart = await db.select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);

    if (userCart.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Cart cleared successfully"
      }, { status: 200 });
    }

    const currentCart = userCart[0];

    // Delete all cart items (cascade will handle this, but we can do it explicitly)
    await db.delete(cartItem)
      .where(eq(cartItem.cartId, currentCart.id));

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully"
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}