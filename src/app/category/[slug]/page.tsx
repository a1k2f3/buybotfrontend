"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { use } from "react";  // ← Add this import
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

// Change the props type: params is now a Promise
export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Unwrap the promise synchronously in this client component
  const { slug } = use(params);

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

  // ... rest of your component remains exactly the same
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
      {/* ... the rest of your JSX unchanged ... */}
    </div>
  );
}