'use client';

import React from 'react';
// import ProductsSection from './ProductsSection';
import ProductsSection from '@/components/card/ProductSection';
export default function BrowseProductsPage() {
  return (
    <>
      {/* Optional Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-6 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Browse Products
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Explore our latest collection of premium products
          </p>
        </div>
      </section>

      {/* Main Products Section */}
      <ProductsSection />

      {/* Optional Footer CTA */}
      <section className="bg-gray-100 py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Want to sell your own products?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Seller features are coming soon — get early access now!
          </p>
          <a
            href="/sell" // or your actual route
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg className="mr-3 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.967.967-3.734-.215-.361a9.86 9.86 0 01-1.378-5.021 9.97 9.97 0 0110.002-9.999 9.97 9.97 0 019.999 10.002 9.97 9.97 0 01-9.999 9.999z"/>
            </svg>
            Request Early Access via WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}