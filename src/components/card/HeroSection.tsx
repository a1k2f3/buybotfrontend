"use client";

import { motion } from "framer-motion";
import { FaShoppingBag } from "react-icons/fa";
import { AiOutlineRobot } from "react-icons/ai";

export default function MainSection() {
  return (
    <section className="bg-gradient-to-b from-white to-blue-50 flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-20 min-h-[90vh]">
      {/* ✅ Left Text Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-xl text-center md:text-left"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
          Shop smarter with <span className="text-blue-600">BuyBot&apos;s</span> AI assistant
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          Your AI-powered shopping assistant that helps you discover the best products, compare prices, 
          and shop effortlessly across trusted vendors.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all">
            Get Started
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-100 transition-all">
            Explore Vendors
          </button>
        </div>
      </motion.div>

      {/* ✅ Right Illustration Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-10 md:mt-0 relative"
      >
        <div className="relative w-[300px] md:w-[400px] h-[300px] md:h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-60" />
          <div className="relative bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
            <AiOutlineRobot className="w-16 h-16 text-blue-600 mb-4 animate-bounce" />
            <p className="text-gray-700 font-semibold text-lg">
              Hello! I&apos;m BuyBot.
            </p>
            <p className="text-gray-500 text-sm mt-2 text-center">
              Let me help you find the perfect deal today!
            </p>
            <FaShoppingBag className="w-12 h-12 text-blue-500 mt-6" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
