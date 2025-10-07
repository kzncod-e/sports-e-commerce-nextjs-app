import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { review } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(5).max(1000).optional(),
}).refine(data => data.rating !== undefined || data.comment !== undefined, {
  message: "At least one field (rating or comment) must be provided"
});

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

    const reviewId = parseInt(params.id);
    
    if (!reviewId || isNaN(reviewId)) {
      return NextResponse.json(
        { success: false, message: 'Valid review ID is required' },
        { status: 400 }
      );
    }

    const existingReview = await db.select()
      .from(review)
      .where(eq(review.id, reviewId))
      .limit(1);

    if (existingReview.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }

    if (existingReview[0].userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to update this review' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = updateReviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: validationResult.error.errors[0].message 
        },
        { status: 400 }
      );
    }

    const { rating, comment } = validationResult.data;

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    if (rating !== undefined) {
      updateData.rating = rating;
    }

    if (comment !== undefined) {
      updateData.comment = comment;
    }

    const updatedReview = await db.update(review)
      .set(updateData)
      .where(and(eq(review.id, reviewId), eq(review.userId, userId)))
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Review updated successfully',
        data: updatedReview[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('PUT review error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const reviewId = parseInt(params.id);
    
    if (!reviewId || isNaN(reviewId)) {
      return NextResponse.json(
        { success: false, message: 'Valid review ID is required' },
        { status: 400 }
      );
    }

    const existingReview = await db.select()
      .from(review)
      .where(eq(review.id, reviewId))
      .limit(1);

    if (existingReview.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }

    if (existingReview[0].userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to delete this review' },
        { status: 403 }
      );
    }

    await db.delete(review)
      .where(and(eq(review.id, reviewId), eq(review.userId, userId)))
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Review deleted successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE review error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}