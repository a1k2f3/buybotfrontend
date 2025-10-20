"use client";

import { motion } from "framer-motion";
import { FaLaptop, FaTshirt, FaMobileAlt, FaHome, FaShoppingCart } from "react-icons/fa";
import CategoryCard from "./CatagoryCard";

export default function CategoriesSection() {
  return (
    <section className="py-16 px-8 md:px-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 text-center mb-10"
      >
        Shop by Category
      </motion.h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
        <CategoryCard icon={<FaLaptop />} title="Electronics" />
        <CategoryCard icon={<FaTshirt />} title="Fashion" />
        <CategoryCard icon={<FaMobileAlt />} title="Mobiles" />
        <CategoryCard icon={<FaHome />} title="Home" />
        <CategoryCard icon={<FaShoppingCart />} title="Accessories" />
      </div>
    </section>
  );
}
