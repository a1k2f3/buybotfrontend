"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
}

export default function CategoryCard({ icon, title }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -6 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-6 w-28 h-28 md:w-36 md:h-36 cursor-pointer hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      <div className="text-blue-600 mb-3">{icon}</div>
      <p className="text-gray-800 text-sm md:text-base font-semibold text-center line-clamp-2">
        {title}
      </p>
    </motion.div>
  );
}