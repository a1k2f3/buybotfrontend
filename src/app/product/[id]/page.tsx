// app/products/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShoppingCart, Check, Truck, Shield, Star } from "lucide-react";

import ProductGallery from "@/components/card/ProductGallery";
import ReviewsSection from "@/components/card/ReviewsSection";
import ProductActions from "@/components/card/ProductActions";
import ProductSpecs from "@/components/card/ProductSpecs";
import ProductHighlights from "@/components/card/ProductHighlights";

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

// THIS IS THE ONLY CHANGE YOU NEED
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>; // ← params is now a Promise!
}) {
  const { id } = await params; // ← Await it here!

  const productData = await getProduct(id);

  if (!productData || !productData.success) {
    notFound();
  }

  const { data: product, relatedProducts } = productData;

  const images = [
    { id: "main", url: product.thumbnail },
    ...(product.images?.map((img: any) => ({ id: img._id, url: img.url })) || []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-indigo-600 transition">Home</Link>
            </li>
            <li><span className="mx-2">/</span></li>
            {product.category && (
              <>
                <li>
                  <Link href={`/category/${product.category.slug}`} className="hover:text-indigo-600 transition">
                    {product.category.name}
                  </Link>
                </li>
                <li><span className="mx-2">/</span></li>
              </>
            )}
            <li className="font-medium text-gray-900 truncate max-w-xs">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <ProductGallery images={images} productName={product.name} />

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title + Rating */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold text-indigo-600">
                {product.price.toLocaleString()}
                <span className="text-2xl font-normal ml-1">{product.currency || "RS"}</span>
              </span>
              {product.stock < 10 && product.stock > 0 && (
                <span className="text-red-600 font-bold bg-red-50 px-4 py-2 rounded-full animate-pulse">
                  Only {product.stock} left!
                </span>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed text-base">
              {product.description}
            </p>

            {/* Highlights */}
            {product.highlights && <ProductHighlights highlights={product.highlights} />}

            {/* Interactive Actions (Client Component) */}
            <ProductActions product={product} />

            {/* Specifications */}
            {product.specifications && <ProductSpecs specs={product.specifications} />}
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-20">
          <ReviewsSection reviews={product.reviews || []} rating={product.rating || 0} />
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <section className="mt-24">
            <h2 className="text-3xl font-bold mb-10 text-center lg:text-left">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item: any) => (
                <Link
                  key={item._id}
                  href={`/products/${item.slug || item._id}`}
                  className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={item.thumbnail}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition">
                      {item.name}
                    </h3>
                    <p className="text-indigo-600 font-bold mt-2 text-lg">
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