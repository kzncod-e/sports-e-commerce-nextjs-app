'use client';

import { ParallaxHero } from '@/components/ParallaxHero';
import { FeaturedCollections } from '@/components/FeaturedCollections';
import { ProductCarousel } from '@/components/ProductCarousel';
import { StatsSection } from '@/components/StatsSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { products } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Zap, Shield, Truck } from 'lucide-react';

export default function Home() {
  const featuredProducts = products.filter((p) => p.featured);
  const trendingProducts = products.filter((p) => p.trending);

  return (
    <div>
      {/* Hero Section */}
      <ParallaxHero />

      {/* Features Section */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-start gap-4"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
                <p className="text-muted-foreground">
                  Free delivery on orders over $100
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
                <p className="text-muted-foreground">
                  100% secure payment processing
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-start gap-4"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Quality Guarantee</h3>
                <p className="text-muted-foreground">
                  Premium products from trusted brands
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <FeaturedCollections />

      {/* Trending Products */}
      <ProductCarousel
        products={trendingProducts}
        title="Trending Now"
        subtitle="The hottest picks this season"
      />

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Products */}
      <ProductCarousel
        products={featuredProducts}
        title="Featured Products"
        subtitle="Handpicked favorites for peak performance"
      />

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div
              className="relative h-[400px] bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1920&q=80)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-8">
                  <div className="max-w-2xl">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                      Train Like a Champion
                    </h2>
                    <p className="text-xl text-gray-200 mb-8">
                      Get access to exclusive training gear and performance
                      equipment used by professional athletes.
                    </p>
                    <Button size="lg" className="text-lg" asChild>
                      <Link href="/products">
                        Explore Collection
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}