"use client";

import HeroSection from "@/components/card/HeroSection";
import CategoriesSection from "@/components/card/Catagorysection";
import ProductsSection from "@/components/card/ProductSection";
import Footer from "@/components/card/Footer";
import Slider from "@/components/card/Slider";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 text-gray-800">
       {/* Adjust based on navbar height */}
  <div className="mt-10">
  <Slider />
  </div>
      <CategoriesSection />
      <ProductsSection />
      <Footer />
    </main>
  );
}
