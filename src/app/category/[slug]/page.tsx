// app/category/[slug]/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { Package, ArrowLeft, Grid3X3, List, Loader2 } from "lucide-react";

const API_BASE = "https://buybotbackend-production.up.railway.app";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  thumbnail: string;
  images: { url: string }[];
  reviews: { rating: number }[];
  stock: number;
  status: string;
  category: { name: string };
}

interface CategoryData {
  name: string;
  description?: string;
  productCount: number;
  imageUrl?: string;
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE}/api/products/category/${slug}`);

        if (!response.ok) {
          if (response.status === 404) notFound();
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        const productsData: Product[] = Array.isArray(data) ? data : data.products || data.data || [];

        const categoryInfo = {
          name: productsData[0]?.category?.name || slug.replace(/-/g, " ").toUpperCase(),
          productCount: productsData.length,
          description: "Explore the latest products in this category.",
          imageUrl: productsData[0]?.images[0]?.url || "/images/fallback-category.jpg",
        };

        setProducts(productsData);
        setCategory(categoryInfo);
      } catch (err: any) {
        console.error("Error fetching category:", err);
        setError("Failed to load products. Please try again later.");
        setCategory({
          name: slug.replace(/-/g, " ").toUpperCase(),
          productCount: 0,
          description: "Category not found.",
        });
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Oops!</h2>
          <p className="text-gray-600 mt-2">{error || "Category not found"}</p>
        </div>
      </div>
    );
  }

  const displayedProducts = products.filter(p => p.status === "active" && p.stock > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <Image
          src={category.imageUrl || "/images/fallback-category.jpg"}
          alt={category.name}
          fill
          className="object-cover brightness-50"
          priority
          onError={(e) => (e.currentTarget.src = "/images/fallback-category.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative h-full flex flex-col justify-end container mx-auto px-4 pb-10 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm md:text-base transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Categories
            </Link>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl">
              {category.name}
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mt-3 max-w-3xl">
              {category.description}
            </p>
            <p className="text-base md:text-lg text-white/80 mt-2">
              {displayedProducts.length} Products Available
            </p>
          </motion.div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <p className="text-sm md:text-base text-gray-600">
            Showing <span className="font-semibold">{displayedProducts.length}</span> products
          </p>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">View:</span>
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 transition ${viewMode === "list" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {displayedProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No products available in this category yet.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
          >
            {displayedProducts.map((product, i) => {
              const hasDiscount = product.discountPrice && product.discountPrice < product.price;
              const finalPrice = hasDiscount ? product.discountPrice! : product.price;
              const discountPercent = hasDiscount
                ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
                : 0;

              const avgRating = product.reviews.length > 0
                ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
                : 0;

              return (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -6 }}
                  className="group"
                >
                  <Link href={`/product/${product._id}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                      {/* High-quality image with proper sizing */}
                      <div className="relative aspect-square bg-gray-50">
                        <Image
                          src={product.thumbnail || product.images[0]?.url || "/images/placeholder.jpg"}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          priority={i < 10} // Prioritize first 10 images
                          quality={85}
                          onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
                        />
                        {hasDiscount && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            -{discountPercent}%
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-3 md:p-4">
                        <h3 className="font-medium text-sm md:text-base line-clamp-2 text-gray-800 group-hover:text-indigo-600 transition">
                          {product.name}
                        </h3>

                        <div className="mt-2 flex items-end gap-2">
                          <span className="text-lg md:text-xl font-bold text-gray-900">
                            Rs. {finalPrice.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs md:text-sm text-gray-500 line-through">
                              Rs. {product.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {product.reviews.length > 0 && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <div className="flex text-yellow-400 text-xs md:text-sm">
                              {"★".repeat(Math.floor(avgRating))}
                              {"☆".repeat(5 - Math.floor(avgRating))}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({product.reviews.length})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}