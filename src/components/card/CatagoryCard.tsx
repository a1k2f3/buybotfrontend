"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl: string;
  productCount: number;
}

export default function CategoryCard({
  name,
  slug,
  imageUrl,
  productCount,
}: CategoryCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/category/${slug}`} prefetch={false}>
      <motion.div
        // Lift + scale on hover
        whileHover={{ y: -12, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative w-28 h-36 md:w-40 md:h-52 bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer 
                   hover:shadow-2xl hover:ring-4 hover:ring-indigo-500/30 
                   transition-all duration-500 border border-gray-100"
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image with parallax zoom */}
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={imgError ? "/fallback-category.jpg" : imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 120px, 180px"
            className="object-cover 
                       group-hover:scale-125 
                       transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
            priority={false}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70" />
          
          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center transform-gpu">
          <motion.h3
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white font-bold text-base md:text-lg drop-shadow-2xl tracking-tight line-clamp-2"
          >
            {name}
          </motion.h3>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/90 text-xs md:text-sm font-semibold mt-1 drop-shadow-lg"
          >
            {productCount.toLocaleString()} {productCount === 1 ? "Product" : "Products"}
          </motion.p>
        </div>

        {/* Floating Badge with pulse */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute top-3 right-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                     text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-2xl 
                     ring-4 ring-white/50 z-20"
        >
          {productCount}
        </motion.div>

        {/* Arrow indicator on hover */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute top-1/2 -right-2 -translate-y-1/2 
                     bg-white text-indigo-600 p-2 rounded-full shadow-lg z-20"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
          </svg>
        </motion.div>
      </motion.div>
    </Link>
  );
}