"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
}

export default function ProductCard({ name, price, image }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
    >
      <div className="w-full h-56 relative">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div className="p-5 text-center">
        <h3 className="font-semibold text-lg text-gray-700">{name}</h3>
        <p className="text-blue-600 font-bold mt-2">{price}</p>
        <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all">
          View Product
        </button>
      </div>
    </motion.div>
  );
}
