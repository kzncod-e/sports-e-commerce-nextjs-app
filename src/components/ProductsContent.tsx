"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Category, Product } from "@/types";

export function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [order, setOrder] = useState<string>("asc");
  useEffect(() => {
    const params = new URLSearchParams();
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        if (priceRange) {
          priceRange[0] && params.append("minPrice", priceRange[0].toString());
          priceRange[1] && params.append("maxPrice", priceRange[1].toString());
        }
        if (sortBy) {
          params.append("sortBy", sortBy);
        }
        if (order) {
          params.append("order", order);
        }
        if (selectedCategories.length > 0) {
          selectedCategories.forEach((cat) => params.append("category", cat));
        }
        const debounce = setTimeout(async () => {
          const productsResponse = await fetch(
            `/api/products?${params.toString()}`
          );
          const productsData = await productsResponse.json();
          console.log(productsData);
          // Fetch categories

          if (productsData.success && productsData.data.products) {
            const transformedProducts = productsData.data.products.map(
              (p: any) => ({
                id: String(p.id),
                slug: String(p.id),
                name: p.name,
                description: p.description,
                price: p.price,
                category: categories.find((c) => c.id === p.categoryId)
                  ? categories.find((c) => c.id === p.categoryId)!.name
                  : "Uncategorized",
                brand: "Premium",
                images: [
                  p.imageURL ||
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
                ],
                sizes: ["7", "8", "9", "10", "11", "12"],
                colors: ["Black", "White", "Blue"],
                inStock: p.stock > 0,
                featured: false,
                trending: false,
                rating: 4.5,
                reviews: p.reviewsCount || 0,
              })
            );
            setProducts(transformedProducts);
          }
          return () => clearTimeout(debounce);
        }, 1000);
        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success && categoriesData.data) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategories, selectedBrands, priceRange, sortBy, order]);

  // Get unique brands
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  // Filter and sort products
  // const filteredProducts = useMemo(() => {
  //   let filtered = products.filter((product) => {
  //     // Search query
  //     if (
  //       searchQuery &&
  //       !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
  //       !product.description.toLowerCase().includes(searchQuery.toLowerCase())
  //     ) {
  //       return false;
  //     }

  //     // Categories
  //     if (
  //       selectedCategories.length > 0 &&
  //       !selectedCategories.includes(product.category)
  //     ) {
  //       return false;
  //     }

  //     // Brands
  //     if (
  //       selectedBrands.length > 0 &&
  //       !selectedBrands.includes(product.brand)
  //     ) {
  //       return false;
  //     }

  //     // Price range
  //     if (product.price < priceRange[0] || product.price > priceRange[1]) {
  //       return false;
  //     }

  //     // In stock
  //     if (showInStockOnly && !product.inStock) {
  //       return false;
  //     }

  //     return true;
  //   });

  //   // Sort
  //   switch (sortBy) {
  //     case "price-asc":
  //       filtered.sort((a, b) => a.price - b.price);
  //       break;
  //     case "price-desc":
  //       filtered.sort((a, b) => b.price - a.price);
  //       break;
  //     case "newest":
  //       // In a real app, sort by date
  //       break;
  //     case "popular":
  //     default:
  //       filtered.sort((a, b) => b.rating - a.rating);
  //       break;
  //   }

  //   return filtered;
  // }, [
  //   products,
  //   searchQuery,
  //   selectedCategories,
  //   selectedBrands,
  //   priceRange,
  //   sortBy,
  //   showInStockOnly,
  // ]);
  const handleSortChange = (value: string) => {
    if (value === "price-asc") {
      setOrder("asc");
      setSortBy("price");
    } else if (value === "price-desc") {
      setOrder("desc");
      setSortBy("price");
    } else if (value === "newest") {
      setOrder("desc");
      setSortBy("createdAt");
    } else {
      setOrder("desc");
      setSortBy("popular");
    }
  };
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 300]);
    setShowInStockOnly(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id.toString()}
              className="flex items-center space-x-2">
              <Checkbox
                id={category.id.toString()}
                checked={selectedCategories.includes(category.id.toString())}
                onCheckedChange={() =>
                  handleCategoryToggle(category.id.toString())
                }
              />
              <label
                htmlFor={category.id.toString()}
                className="text-sm capitalize cursor-pointer">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => handleBrandToggle(brand)}
              />
              <label htmlFor={brand} className="text-sm cursor-pointer">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="300"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full"
          />
        </div>
      </div>

      {/* In Stock */}
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={showInStockOnly}
            onCheckedChange={(checked) =>
              setShowInStockOnly(checked as boolean)
            }
          />
          <label htmlFor="inStock" className="text-sm cursor-pointer">
            In Stock Only
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All Products
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover our complete collection of premium sports equipment
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All Products
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover our complete collection of premium sports equipment
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 ||
              selectedBrands.length > 0 ||
              showInStockOnly) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedCategories.map((category, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCategoryToggle(category)}>
                    <span className="capitalize">
                      {categories
                        .filter((cat) => cat.id.toString() === category)
                        .map((cat) => cat.name)}
                    </span>
                    <X className="ml-2 h-3 w-3" />
                  </Button>
                ))}
                {selectedBrands.map((brand) => (
                  <Button
                    key={brand}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleBrandToggle(brand)}>
                    {brand}
                    <X className="ml-2 h-3 w-3" />
                  </Button>
                ))}
                {showInStockOnly && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowInStockOnly(false)}>
                    In Stock Only
                    <X className="ml-2 h-3 w-3" />
                  </Button>
                )}
              </div>
            )}

            {/* Results Count */}
            <p className="mb-6 text-muted-foreground">
              Showing {products.length}{" "}
              {products.length === 1 ? "product" : "products"}
            </p>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground mb-4">
                  No products found matching your criteria
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
