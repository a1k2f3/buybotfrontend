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
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-6 w-28 h-28 md:w-32 md:h-32 cursor-pointer hover:shadow-lg transition-all"
    >
      <div className="text-blue-600 text-3xl mb-2">{icon}</div>
      <p className="text-gray-700 text-sm font-medium">{title}</p>
    </motion.div>
  );
}
