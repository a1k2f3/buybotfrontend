"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const products = [
  { id: 1, name: "Smart Watch", price: "$99", image: "/images/watch.jpg" },
  { id: 2, name: "Wireless Earbuds", price: "$59", image: "/images/earbuds.jpg" },
  { id: 3, name: "Gaming Laptop", price: "$899", image: "/images/laptop.jpg" },
  { id: 4, name: "Running Shoes", price: "$79", image: "/images/shoes.jpg" },
];

export default function ProductsSection() {
  return (
    <section className="py-16 px-8 md:px-20 bg-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 text-center mb-10"
      >
        Featured product
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} name={p.name} price={p.price} image={p.image} />
        ))}
      </div>
    </section>
  );
}
