"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CategoryCard from "./CatagoryCard"; // ← your new image card

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: {
    url: string;
    public_id: string;
  };
  productCount: number;
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/categories/tree`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch categories");

        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        // Keep loading false so UI doesn't hang
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="w-28 h-36 md:w-36 md:h-44 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null; // or show a message
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
      <div className="flex md:hidden overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-hide px-4">
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
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 justify-center">
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