'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart-store';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addItem(product, product.sizes[0], product.colors[0], 1);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden rounded-lg border bg-card">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Badges */}
            <div className="absolute left-2 top-2 flex flex-col gap-2">
              {discount > 0 && (
                <Badge variant="destructive">{discount}% OFF</Badge>
              )}
              {product.trending && (
                <Badge className="bg-orange-500 hover:bg-orange-600">Trending</Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary">Out of Stock</Badge>
              )}
            </div>

            {/* Quick Add Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-2 left-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Button
                className="w-full"
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isAdding ? 'Added!' : 'Quick Add'}
              </Button>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase">
                {product.brand}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{product.rating}</span>
              </div>
            </div>

            <h3 className="font-semibold line-clamp-1 mb-2">
              {product.name}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Colors */}
            <div className="mt-3 flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Colors:</span>
              <div className="flex space-x-1">
                {product.colors.slice(0, 4).map((color) => (
                  <div
                    key={color}
                    className="h-4 w-4 rounded-full border border-border"
                    style={{
                      backgroundColor: color.toLowerCase(),
                    }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}