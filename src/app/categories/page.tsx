"use client";

import CategoryCard from "@/components/card/CatagoryCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate ISR cache every 60 seconds

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: { url: string; public_id: string };
  productCount: number;
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [visibleCount, setVisibleCount] = useState(10); // Start with 10 visible
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!baseUrl) {
          throw new Error("API base URL is not defined");
        }

        const response = await fetch(`${baseUrl}/api/categories`, {
          cache: "no-store", // Always fresh data on client
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid response format");
        }

        const fetchedCategories: Category[] = result.data;

        // Immediately show first 10
        setCategories(fetchedCategories);
        setVisibleCount(10);

        // After a short delay, reveal all (smooth staggered animation)
        if (fetchedCategories.length > 10) {
          setTimeout(() => {
            setVisibleCount(fetchedCategories.length);
          }, 600);
        }

        setError(null);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Visible categories based on current visibleCount
  const categoriesToShow = categories.slice(0, visibleCount);

  // Loading Skeleton
  if (loading) {
    return (
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // Optional: Show error message instead of silent null
  if (error) {
    return (
      <section className="py-16 px-6 md:px-20 bg-gray-50 text-center">
        <h2 className="text-4xl font-bold mb-8 text-gray-900">
          Shop by Category
        </h2>
        <p className="text-red-600">{error}</p>
      </section>
    );
  }

  if (categories.length === 0) {
    return null; // Or show "No categories available"
  }

  return (
    <section className="py-16 px-6 md:px-20 bg-gray-50">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-12 text-gray-900"
      >
        Shop by Category
      </motion.h2>

      {/* Mobile: Horizontal Scroll */}
      <div className="flex md:hidden overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
        {categoriesToShow.map((cat, index) => (
          <motion.div
            key={cat._id}
            className="flex-shrink-0"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.06,
              duration: 0.5,
            }}
          >
            <CategoryCard
              name={cat.name}
              slug={cat.slug}
              imageUrl={cat.image.url}
              productCount={cat.productCount}
            />
          </motion.div>
        ))}
      </div>

      {/* Desktop: Responsive Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
        {categoriesToShow.map((cat, index) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.08,
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            <CategoryCard
              name={cat.name}
              slug={cat.slug}
              imageUrl={cat.image.url}
              productCount={cat.productCount}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}