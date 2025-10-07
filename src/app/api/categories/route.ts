import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { category, product } from '@/db/schema';
import { eq, sql, asc } from 'drizzle-orm';

const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100, 'Slug must not exceed 100 characters').toLowerCase().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters').optional(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100, 'Slug must not exceed 100 characters').toLowerCase().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
});

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({
          success: false,
          message: 'Valid ID is required'
        }, { status: 400 });
      }

      const categories = await db.select()
        .from(category)
        .where(eq(category.id, parseInt(id)))
        .limit(1);

      if (categories.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'Category not found'
        }, { status: 404 });
      }

      const products = await db.select()
        .from(product)
        .where(eq(product.categoryId, parseInt(id)));

      return NextResponse.json({
        success: true,
        data: {
          category: categories[0],
          products
        }
      }, { status: 200 });
    }

    const categories = await db.select({
      id: category.id,
      name: category.name,
      slug: category.slug,
      createdAt: category.createdAt,
      productsCount: sql<number>`cast(count(${product.id}) as integer)`,
    })
      .from(category)
      .leftJoin(product, eq(category.id, product.categoryId))
      .groupBy(category.id)
      .orderBy(asc(category.name));

    return NextResponse.json({
      success: true,
      data: categories
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

    const validation = createCategorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: validation.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const { name, slug: providedSlug } = validation.data;
    const slug = providedSlug || generateSlug(name);

    const existingCategory = await db.select()
      .from(category)
      .where(eq(category.slug, slug))
      .limit(1);

    if (existingCategory.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Category with this slug already exists'
      }, { status: 409 });
    }

    const newCategory = await db.insert(category)
      .values({
        name,
        slug,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newCategory[0]
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        success: false,
        message: 'Valid ID is required'
      }, { status: 400 });
    }

    const body = await request.json();

    const validation = updateCategorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: validation.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const existingCategory = await db.select()
      .from(category)
      .where(eq(category.id, parseInt(id)))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Category not found'
      }, { status: 404 });
    }

    const { name, slug } = validation.data;

    if (slug && slug !== existingCategory[0].slug) {
      const duplicateSlug = await db.select()
        .from(category)
        .where(eq(category.slug, slug))
        .limit(1);

      if (duplicateSlug.length > 0) {
        return NextResponse.json({
          success: false,
          message: 'Category with this slug already exists'
        }, { status: 409 });
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        success: true,
        data: existingCategory[0],
        message: 'Category updated successfully'
      }, { status: 200 });
    }

    const updatedCategory = await db.update(category)
      .set(updateData)
      .where(eq(category.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedCategory[0],
      message: 'Category updated successfully'
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        success: false,
        message: 'Valid ID is required'
      }, { status: 400 });
    }

    const existingCategory = await db.select()
      .from(category)
      .where(eq(category.id, parseInt(id)))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Category not found'
      }, { status: 404 });
    }

    const productsInCategory = await db.select()
      .from(product)
      .where(eq(product.categoryId, parseInt(id)))
      .limit(1);

    if (productsInCategory.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Cannot delete category with products'
      }, { status: 400 });
    }

    await db.delete(category)
      .where(eq(category.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      data: { id: parseInt(id) }
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}