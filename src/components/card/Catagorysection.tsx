"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CategoryCard from "./CatagoryCard";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: { url: string; public_id: string };
  productCount: number;
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // This will work 100% if backend is running
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/categories`, {
          cache: "no-store",
        });

        console.log("Response Status:", response.status); // Debug

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log("Full API Response:", result); // See exactly what backend returns

        if (result.success && Array.isArray(result.data)) {
          setCategories(result.data);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err: any) {
        console.error("Fetch failed:", err.message);
        setError("Failed to load categories");
        setCategories([]); // Silent fallback
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Show loading
  if (loading) {
    return (
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-32 h-40 md:w-40 md:h-48 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // Show error (optional – remove if you want silent fail)
  if (error) {
    return null; // or show a small message
    // return <div className="text-center text-red-600 py-10">{error}</div>
  }

  // Final render – only shows if data exists
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

      {/* Mobile: Scroll */}
      <div className="flex md:hidden overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide px-4">
        {categories.map((cat) => (
          <div key={cat._id} className="flex-shrink-0">
            <CategoryCard
              name={cat.name}
              slug={cat.slug}
              imageUrl={cat.image.url}
              productCount={cat.productCount}
            />
          </div>
        ))}
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 justify-center max-w-7xl mx-auto">
        {categories.map((cat) => (
          <CategoryCard
            key={cat._id}
            name={cat.name}
            slug={cat.slug}
            imageUrl={cat.image.url}
            productCount={cat.productCount}
          />
        ))}
      </div>
    </section>
  );
}