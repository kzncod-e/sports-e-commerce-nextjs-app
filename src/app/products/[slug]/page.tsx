'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart-store';
import { ShoppingCart, Star, Heart, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductCarousel } from '@/components/ProductCarousel';
import { Product } from '@/types';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?id=${params.slug}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const p = data.data.product;
          const transformedProduct: Product = {
            id: String(p.id),
            slug: String(p.id),
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category?.slug || 'uncategorized',
            brand: 'Premium',
            images: [p.imageURL || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
            sizes: ['7', '8', '9', '10', '11', '12'],
            colors: ['Black', 'White', 'Blue'],
            inStock: p.stock > 0,
            featured: false,
            trending: false,
            rating: 4.5,
            reviews: data.data.reviews?.length || 0,
          };
          
          setProduct(transformedProduct);
          setSelectedSize(transformedProduct.sizes[0]);
          setSelectedColor(transformedProduct.colors[0]);
          
          // Transform related products
          if (data.data.relatedProducts && data.data.relatedProducts.length > 0) {
            const related = data.data.relatedProducts.map((rp: any) => ({
              id: String(rp.id),
              slug: String(rp.id),
              name: rp.name,
              description: rp.description,
              price: rp.price,
              category: p.category?.slug || 'uncategorized',
              brand: 'Premium',
              images: [rp.imageURL || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
              sizes: ['7', '8', '9', '10', '11', '12'],
              colors: ['Black', 'White', 'Blue'],
              inStock: rp.stock > 0,
              featured: false,
              trending: false,
              rating: 4.5,
              reviews: 0,
            }));
            setRelatedProducts(related);
          }
        } else {
          notFound();
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, selectedSize, selectedColor, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-foreground capitalize">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {discount > 0 && (
                  <Badge variant="destructive" className="text-base px-3 py-1">
                    {discount}% OFF
                  </Badge>
                )}
                {product.trending && (
                  <Badge className="bg-orange-500 hover:bg-orange-600 text-base px-3 py-1">
                    Trending
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                {product.brand}
              </p>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-2xl text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Size: <span className="font-normal text-muted-foreground">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative h-10 px-4 rounded-lg border-2 font-medium transition-all ${
                      selectedColor === color
                        ? 'border-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      <span>{color}</span>
                    </div>
                    {selectedColor === color && (
                      <div className="absolute -right-1 -top-1 bg-primary rounded-full p-0.5">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold mb-3">Quantity</label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1 text-lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center"
                    >
                      <Check className="mr-2 h-5 w-5" />
                      Added to Cart!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2 text-sm">
              {product.inStock ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-green-600 font-medium">In Stock</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <Link
                  href={`/products?category=${product.category}`}
                  className="font-medium hover:text-primary capitalize"
                >
                  {product.category}
                </Link>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Brand:</span>
                <span className="font-medium">{product.brand}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <ProductCarousel
              products={relatedProducts}
              title="You May Also Like"
              subtitle="Similar products in this category"
            />
          </div>
        )}
      </div>
    </div>
  );
}