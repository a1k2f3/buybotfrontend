"use client";

import CategoryCard from "@/components/card/CatagoryCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: { url: string; public_id: string };
  productCount: number;
}

export default function CategoriesSection() {
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/categories`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const categories = result.data;

          // First: Show only first 10 immediately
          setVisibleCategories(categories.slice(0, 10));

          // Then: Load the rest after a tiny delay (feels smoother)
          setTimeout(() => {
            setAllCategories(categories);
            setVisibleCategories(categories); // Now show all
          }, 600); // Adjust timing as needed (300–800ms feels natural)

          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err: any) {
        console.error("Fetch failed:", err.message);
        setError("Failed to load categories");
        setVisibleCategories([]);
        setAllCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="w-32 h-40 md:w-40 md:h-48 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return null; // Silent fallback
  }

  const categoriesToShow = visibleCategories.length > 10 ? visibleCategories : allCategories;

  return (
    <section className="py-16 px-6 md:px-20 bg-gray-50">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center mb-12 text-gray-900"
      >
        Shop by Category
      </motion.h2>

      {/* Mobile: Horizontal Scroll */}
      <div className="flex md:hidden overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide px-4">
        {categoriesToShow.map((cat, index) => (
          <motion.div
            key={cat._id}
            className="flex-shrink-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index < 10 ? index * 0.05 : (index - 10) * 0.05 + 0.6 }}
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

      {/* Desktop: Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 justify-center max-w-7xl mx-auto">
        {categoriesToShow.map((cat, index) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index < 10 ? index * 0.08 : (index - 10) * 0.08 + 0.6,
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
    </section>
  );
}