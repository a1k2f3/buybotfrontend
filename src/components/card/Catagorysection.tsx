"use client";

import { motion } from "framer-motion";
import { FaLaptop, FaTshirt, FaMobileAlt, FaHome, FaShoppingCart } from "react-icons/fa";
import CategoryCard from "./CatagoryCard";

export default function CategoriesSection() {
  const categories = [
    { icon: <FaLaptop />, title: "Electronics" },
    { icon: <FaTshirt />, title: "Fashion" },
    { icon: <FaMobileAlt />, title: "Mobiles" },
    { icon: <FaHome />, title: "Home" },
    { icon: <FaShoppingCart />, title: "Accessories" },
  ];

  return (
    <section className="py-16 px-6 md:px-20">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 text-center mb-10"
      >
        Shop by Category
      </motion.h2>

      {/* ✅ Mobile Carousel */}
      <div className="flex md:hidden overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-hide">
        {categories.map((cat, index) => (
          <div key={index} className="flex-shrink-0 w-40 snap-center">
            <CategoryCard icon={cat.icon} title={cat.title} />
          </div>
        ))}
      </div>

      {/* ✅ Desktop Grid */}
      <div className="hidden md:grid grid-cols-5 gap-6 justify-items-center">
        {categories.map((cat, index) => (
          <CategoryCard key={index} icon={cat.icon} title={cat.title} />
        ))}
      </div>
    </section>
  );
}
