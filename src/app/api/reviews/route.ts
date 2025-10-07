import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { review, product, user } from '@/db/schema';
import { eq, and, desc, avg, count, sql } from 'drizzle-orm';

const createReviewSchema = z.object({
  productId: z.number().int({ message: 'productId must be an integer' }),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(5, 'Comment must be at least 5 characters').max(1000, 'Comment must be at most 1000 characters').optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!productId) {
      return NextResponse.json({ 
        success: false, 
        message: 'productId is required' 
      }, { status: 400 });
    }

    const productIdInt = parseInt(productId);
    if (isNaN(productIdInt)) {
      return NextResponse.json({ 
        success: false, 
        message: 'productId must be a valid integer' 
      }, { status: 400 });
    }

    const reviews = await db
      .select({
        review: review,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(review)
      .innerJoin(user, eq(review.userId, user.id))
      .where(eq(review.productId, productIdInt))
      .orderBy(desc(review.createdAt))
      .limit(limit)
      .offset(offset);

    const statsResult = await db
      .select({
        averageRating: avg(review.rating),
        totalReviews: count(review.id),
      })
      .from(review)
      .where(eq(review.productId, productIdInt));

    const stats = {
      averageRating: statsResult[0]?.averageRating ? parseFloat(Number(statsResult[0].averageRating).toFixed(2)) : 0,
      totalReviews: statsResult[0]?.totalReviews || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        stats,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required' 
      }, { status: 401 });
    }

    const body = await request.json();

    const validationResult = createReviewSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        success: false, 
        message: validationResult.error.errors[0].message 
      }, { status: 400 });
    }

    const { productId, rating, comment } = validationResult.data;

    const existingProduct = await db
      .select()
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Product not found' 
      }, { status: 404 });
    }

    const existingReview = await db
      .select()
      .from(review)
      .where(and(
        eq(review.userId, userId),
        eq(review.productId, productId)
      ))
      .limit(1);

    if (existingReview.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'You have already reviewed this product' 
      }, { status: 400 });
    }

    const newReview = await db
      .insert(review)
      .values({
        userId,
        productId,
        rating,
        comment: comment || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Review created successfully',
      data: newReview[0],
    }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}