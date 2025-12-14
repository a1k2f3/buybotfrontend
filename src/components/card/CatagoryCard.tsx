"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Package } from "lucide-react"; // Optional: for fallback icon

interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl: string;
  productCount: number;
  icon?: React.ReactNode; // Optional custom icon
}

export default function CategoryCard({
  name,
  slug,
  imageUrl,
  productCount,
  icon,
}: CategoryCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/category/${slug}`} prefetch={false}>
      <motion.div
        whileHover={{ y: -10, scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="group relative w-full max-w-sm h-64 md:h-80 bg-white rounded-3xl overflow-hidden 
                   shadow-lg hover:shadow-2xl border border-gray-100 
                   transition-all duration-500 cursor-pointer
                   ring-4 ring-transparent hover:ring-indigo-500/20"
      >
        {/* Background Image with Parallax Zoom */}
        <div className="absolute inset-0">
          {imgError ? (
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              {icon || <Package className="w-16 h-16 text-indigo-400" />}
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={`${name} category`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              onError={() => setImgError(true)}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhkdGRscHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0BGh0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0d/8QAFgABAQEAAAAAAAAAAAAAAAAAAAEF/8QAHhAAAQQDAAMBAQAAAAAAAAAAAAECBBITABMhQVH/2gAIAQEAAD8AAn5f/9k="
              priority={false}
            />
          )}

          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Subtle Shine Sweep Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200" />
          </div>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8 text-left">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-2xl tracking-tight line-clamp-2">
              {name}
            </h3>
            
            <p className="text-sm md:text-base text-white/90 font-medium mt-2 drop-shadow-lg">
              {productCount.toLocaleString()} {productCount === 1 ? "Product" : "Products"}
            </p>
          </motion.div>

          {/* CTA Button on Hover */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-2 text-white font-semibold"
          >
            <span className="text-sm md:text-base">Shop Now</span>
            <motion.svg
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.div>
        </div>

        {/* Floating Badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
          className="absolute top-4 right-4 bg-gradient-to-br from-indigo-600 to-purple-700 
                     text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full 
                     shadow-2xl ring-4 ring-white/40 backdrop-blur-sm"
        >
          {productCount > 999 ? `${(productCount / 1000).toFixed(1)}k+` : productCount} Items
        </motion.div>
      </motion.div>
    </Link>
  );
}