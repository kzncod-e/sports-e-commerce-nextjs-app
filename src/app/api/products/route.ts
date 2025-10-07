import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { product, category, review, user } from '@/db/schema';
import { eq, like, and, or, gte, lte, desc, asc, sql, ne } from 'drizzle-orm';

const createProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(200, 'Name must not exceed 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int('Stock must be an integer').nonnegative('Stock cannot be negative').default(0),
  imageURL: z.string().url('Invalid URL format').optional(),
  categoryId: z.number().int('Category ID must be an integer').optional(),
  createdBy: z.string().optional(),
});

const updateProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(200, 'Name must not exceed 200 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  price: z.number().positive('Price must be positive').optional(),
  stock: z.number().int('Stock must be an integer').nonnegative('Stock cannot be negative').optional(),
  imageURL: z.string().url('Invalid URL format').optional(),
  categoryId: z.number().int('Category ID must be an integer').optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      const productId = parseInt(id);
      if (isNaN(productId)) {
        return NextResponse.json({
          success: false,
          message: 'Invalid product ID'
        }, { status: 400 });
      }

      const productResult = await db.select()
        .from(product)
        .where(eq(product.id, productId))
        .limit(1);

      if (productResult.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'Product not found'
        }, { status: 404 });
      }

      const productData = productResult[0];

      let categoryData = null;
      if (productData.categoryId) {
        const categoryResult = await db.select()
          .from(category)
          .where(eq(category.id, productData.categoryId))
          .limit(1);
        categoryData = categoryResult.length > 0 ? categoryResult[0] : null;
      }

      const reviewsData = await db.select({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
      })
        .from(review)
        .leftJoin(user, eq(review.userId, user.id))
        .where(eq(review.productId, productId));

      let relatedProductsData = [];
      if (productData.categoryId) {
        relatedProductsData = await db.select()
          .from(product)
          .where(and(
            eq(product.categoryId, productData.categoryId),
            ne(product.id, productId)
          ))
          .limit(4);
      }

      return NextResponse.json({
        success: true,
        data: {
          product: productData,
          category: categoryData,
          reviews: reviewsData,
          relatedProducts: relatedProductsData
        }
      }, { status: 200 });
    }

    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));
    const offset = (page - 1) * limit;

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(product.name, `%${search}%`),
          like(product.description, `%${search}%`)
        )
      );
    }

    if (categoryId) {
      const parsedCategoryId = parseInt(categoryId);
      if (!isNaN(parsedCategoryId)) {
        conditions.push(eq(product.categoryId, parsedCategoryId));
      }
    }

    if (minPrice) {
      const parsedMinPrice = parseFloat(minPrice);
      if (!isNaN(parsedMinPrice)) {
        conditions.push(gte(product.price, parsedMinPrice));
      }
    }

    if (maxPrice) {
      const parsedMaxPrice = parseFloat(maxPrice);
      if (!isNaN(parsedMaxPrice)) {
        conditions.push(lte(product.price, parsedMaxPrice));
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = sortBy === 'price' ? product.price :
                       sortBy === 'name' ? product.name :
                       product.createdAt;
    const sortOrder = order === 'asc' ? asc(sortColumn) : desc(sortColumn);

    const productsQuery = db.select()
      .from(product)
      .where(whereClause)
      .orderBy(sortOrder)
      .limit(limit)
      .offset(offset);

    const productsData = await productsQuery;

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(product)
      .where(whereClause);
    const total = countResult[0].count;

    const productsWithDetails = await Promise.all(
      productsData.map(async (prod) => {
        let categoryData = null;
        if (prod.categoryId) {
          const categoryResult = await db.select()
            .from(category)
            .where(eq(category.id, prod.categoryId))
            .limit(1);
          categoryData = categoryResult.length > 0 ? categoryResult[0] : null;
        }

        const reviewCountResult = await db.select({ count: sql<number>`count(*)` })
          .from(review)
          .where(eq(review.productId, prod.id));
        const reviewsCount = reviewCountResult[0].count;

        return {
          ...prod,
          category: categoryData,
          reviewsCount
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        products: productsWithDetails,
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = createProductSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const validatedData = validationResult.data;

    const newProduct = await db.insert(product)
      .values({
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        stock: validatedData.stock,
        imageURL: validatedData.imageURL,
        categoryId: validatedData.categoryId,
        createdBy: validatedData.createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newProduct[0]
    }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Product ID is required'
      }, { status: 400 });
    }

    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({
        success: false,
        message: 'Valid product ID is required'
      }, { status: 400 });
    }

    const existingProduct = await db.select()
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Product not found'
      }, { status: 404 });
    }

    const body = await request.json();

    const validationResult = updateProductSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const validatedData = validationResult.data;

    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.price !== undefined) updateData.price = validatedData.price;
    if (validatedData.stock !== undefined) updateData.stock = validatedData.stock;
    if (validatedData.imageURL !== undefined) updateData.imageURL = validatedData.imageURL;
    if (validatedData.categoryId !== undefined) updateData.categoryId = validatedData.categoryId;

    const updatedProduct = await db.update(product)
      .set(updateData)
      .where(eq(product.id, productId))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedProduct[0],
      message: 'Product updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Product ID is required'
      }, { status: 400 });
    }

    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({
        success: false,
        message: 'Valid product ID is required'
      }, { status: 400 });
    }

    const existingProduct = await db.select()
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Product not found'
      }, { status: 404 });
    }

    await db.delete(product)
      .where(eq(product.id, productId))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      data: { id: productId }
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}