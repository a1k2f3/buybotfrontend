
"use client"
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShoppingCart, Check, Truck, Shield, Star } from "lucide-react";
// import { useState } from "react";
import { useState } from "react";
// We'll need this for tabs – but since this is Server Component, we'll extract tabs to a Client Component below

import ProductGallery from "@/components/card/ProductGallery";
import ReviewsSection from "@/components/card/ReviewsSection";
import ProductActions from "@/components/card/ProductActions";
import ProductSpecs from "@/components/card/ProductSpecs";
import ProductHighlights from "@/components/card/ProductHighlights";

// === Client Component for Tabs ===




type TabType = "description" | "specifications" | "highlights";

function ProductTabs({
  descriptionPoints,
  specifications,
  highlights,
}: {
  descriptionPoints: string[];
  specifications: any;
  highlights?: string[];
}) {
  const [activeTab, setActiveTab] = useState<TabType>("description");

  const hasSpecs = specifications && Object.keys(specifications).length > 0;
  const hasHighlights = highlights && highlights.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-8 px-8 pt-6">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-4 text-lg font-medium transition-colors relative ${
              activeTab === "description"
                ? "text-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Description
            {activeTab === "description" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />
            )}
          </button>

          {hasSpecs && (
            <button
              onClick={() => setActiveTab("specifications")}
              className={`pb-4 text-lg font-medium transition-colors relative ${
                activeTab === "specifications"
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Specifications
              {activeTab === "specifications" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />
              )}
            </button>
          )}

          {hasHighlights && (
            <button
              onClick={() => setActiveTab("highlights")}
              className={`pb-4 text-lg font-medium transition-colors relative ${
                activeTab === "highlights"
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Key Highlights
              {activeTab === "highlights" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === "description" && (
          <div className="space-y-4">
            <ul className="space-y-4 text-gray-700 text-base lg:text-lg leading-relaxed">
              {descriptionPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="mt-1.5 w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0" />
                  <span>{point.charAt(0).toUpperCase() + point.slice(1)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "specifications" && hasSpecs && (
          <div>
            <ProductSpecs specs={specifications} />
          </div>
        )}

        {activeTab === "highlights" && hasHighlights && (
          <div>
            <ProductHighlights highlights={highlights} />
          </div>
        )}
      </div>
    </div>
  );
}

// === Main Server Component ===
async function getProduct(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiUrl) {
    console.error("API URL not set!");
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/api/products/${id}`, {
      cache: "no-store",
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productData = await getProduct(id);

  if (!productData || !productData.success) {
    notFound();
  }

  const { data: product, relatedProducts } = productData;

  const images = [
    { id: "main", url: product.thumbnail },
    ...(product.images?.map((img: any) => ({ id: img._id, url: img.url })) || []),
  ];

  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  // Process description into bullet points
  const descriptionPoints = product.description
    ? product.description
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .map((line: string) => line.replace(/^[-•*]\s*/, '').trim())
    : ["Premium quality fabric", "Comfortable and breathable", "Perfect for everyday wear", "Machine washable"];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li><Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link></li>
            <li><span className="mx-2 text-gray-400">/</span></li>
            {product.category && (
              <>
                <li><Link href={`/category/${product.category.slug}`} className="hover:text-indigo-600 transition-colors">{product.category.name}</Link></li>
                <li><span className="mx-2 text-gray-400">/</span></li>
              </>
            )}
            <li className="font-medium text-gray-900 truncate max-w-xs">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Gallery + Tabs */}
          <div className="space-y-10">
            <ProductGallery images={images} productName={product.name} />

            {/* Tabs Section */}
            <ProductTabs
              descriptionPoints={descriptionPoints}
              specifications={product.specifications}
              highlights={product.highlights}
            />
          </div>

          {/* Right: Info & Actions */}
          <div className="space-y-10">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{product.reviews?.length || 0} Reviews</span>
                {product.stock < 10 && product.stock > 0 && (
                  <span className="ml-auto text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    Only {product.stock} left!
                  </span>
                )}
              </div>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl lg:text-5xl font-bold text-indigo-600">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xl text-gray-600 font-medium">{product.currency || "RS"}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    className="w-14 h-14 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-indigo-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Need help? <Link href="/size-guide" className="text-indigo-600 hover:underline">View size guide</Link>
              </p>
            </div>

            <ProductActions product={product} />

            <div className="flex flex-wrap gap-6 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-indigo-600" /><span>Free Delivery over 5000 RS</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-indigo-600" /><span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-5 h-5 text-indigo-600" /><span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        <div id="reviews" className="mt-24">
          <ReviewsSection reviews={product.reviews || []} rating={product.rating || 0} />
        </div>

        {relatedProducts?.length > 0 && (
          <section className="mt-32">
            <h2 className="text-3xl font-bold mb-12 text-center lg:text-left">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {relatedProducts.map((item: any) => (
                <Link
                  key={item._id}
                  href={`/products/${item.slug || item._id}`}
                  className="group block bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image src={item.thumbnail} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-medium text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-indigo-600 font-bold mt-3 text-lg">
                      {item.price.toLocaleString()} {item.currency || "RS"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}