'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
  productsCount?: number;
}

export function FeaturedCollections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (data.success && data.data) {
          setCategories(data.data.slice(0, 4)); // Show max 4 categories
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Category images mapping
  const categoryImages: Record<string, string> = {
    'running': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    'basketball': 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800&q=80',
    'training': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    'soccer': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
  };

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover premium sports equipment tailored to your athletic passion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="group relative block overflow-hidden rounded-xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={categoryImages[category.slug] || categoryImages['training']}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    {category.productsCount !== undefined && (
                      <p className="text-sm text-gray-300 mb-3">
                        {category.productsCount} {category.productsCount === 1 ? 'product' : 'products'}
                      </p>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="group-hover:gap-2 transition-all"
                    >
                      Shop Now
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}