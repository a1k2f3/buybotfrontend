"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";

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
  thumbnail?: string;
  images?: Image[];
  category?: Category;
  brand?: Brand;
  tags?: Tag[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Safe fallbacks
  const safeImage = product.thumbnail || product.images?.[0]?.url || "/placeholder.jpg";
  const safeCategory = product.category?.name || "Uncategorized";
  const safeBrand = product.brand?.name || "Unknown Brand";
  const firstTag = product.tags?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="group relative"
    >
      <Link href={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
          
          {/* Image */}
          <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <Image
              src={safeImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            
            {/* Tag Badge - Only if exists */}
            {firstTag && (
              <div className="absolute top-4 left-4 z-10">
                <span
                  className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
                  style={{ backgroundColor: firstTag.color || "#6366f1" }}
                >
                  {firstTag.name}
                </span>
              </div>
            )}

            {/* Quick Add Button */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/70 to-transparent p-6">
              <button className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all shadow-xl">
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium">{safeCategory}</span>
              <span className="text-gray-400">{safeBrand}</span>
            </div>

            <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center justify-between">
              <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.8</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}