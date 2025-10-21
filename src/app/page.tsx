"use client";

import HeroSection from "@/components/card/HeroSection";
import CategoriesSection from "@/components/card/Catagorysection";
import ProductsSection from "@/components/card/ProductSection";
import Footer from "@/components/card/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 text-gray-800">
       {/* Adjust based on navbar height */}
  <HeroSection />

      <CategoriesSection />
      <ProductsSection />
      <Footer />
    </main>
  );
}
