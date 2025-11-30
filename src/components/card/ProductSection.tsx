"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";

interface Tag {
  name: string;
  slug: string;
  color: string;
}

interface Category {
  name: string;
  slug: string;
}

interface Brand {
  name: string;
}

interface Image {
  url: string;
  public_id: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  images: Image[];
  category: Category;
  brand: Brand;
  tags: Tag[];
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/products/random?limit=8");

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        if (data.success && data.data) {
          setProducts(data.data);
        } else {
          throw new Error(data.error || "No products found");
        }
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading State
  if (loading) {
    return (
      <section className="py-20 px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex flex-col items-center justify-center min-h-96">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600 font-medium">Loading amazing products...</p>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="py-20 px-8 text-center">
        <p className="text-red-500 text-lg font-semibold">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked collection of premium products just for you
          </p>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No products available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}