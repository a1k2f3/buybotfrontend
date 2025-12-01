// app/product/[id]/page.tsx
// "use client"
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShoppingCart, Truck, Shield, RefreshCw, Star, ChevronRight } from "lucide-react";

async function getProduct(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${id}`, {
      cache: "no-store",
    //   next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  const productData = await getProduct(id);
  if (!productData?.success || !productData.data) notFound();

  const { data: p, relatedProducts = [] } = productData;

  return (
    <>
      {/* Hero Section - Product Detail */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-indigo-600 transition">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/category/${p.category.slug}`}
              className="hover:text-indigo-600 transition"
            >
              {p.category.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {p.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xl">
                <Image
                  src={p.thumbnail || p.images[0]?.url}
                  alt={p.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  priority
                />
                {p.stock < 10 && p.stock > 0 && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Only {p.stock} Left!
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {p.images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {p.images.map((img: any, idx: number) => (
                    <button
                      key={img._id}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        idx === 0 ? "border-indigo-600 ring-2 ring-indigo-600 ring-offset-2" : "border-gray-300 hover:border-indigo-400"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={`View ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-between">
              <div className="space-y-6">
                {/* Brand & Title */}
                {p.brand && (
                  <Link
                    href={`/brand/${p.brand._id}`}
                    className="text-indigo-600 font-semibold text-sm hover:underline"
                  >
                    {p.brand.name}
                  </Link>
                )}
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {p.name}
                </h1>

                {/* Rating Placeholder */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(124 reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-extrabold text-indigo-600">
                    {p.price.toLocaleString("en-IN")} {p.currency}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹89,999
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    22% OFF
                  </span>
                </div>

                {/* Short Description */}
                <p className="text-lg text-gray-700 leading-relaxed">
                  {p.description}
                </p>

                {/* Tags */}
                {p.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {p.tags.map((tag: any) => (
                      <span
                        key={tag._id}
                        className="px-5 py-2.5 rounded-full text-white font-medium text-sm shadow-md"
                        style={{ backgroundColor: tag.color || "#4f46e5" }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-6 py-8 border-t border-gray-200">
                  <div className="flex flex-col items-center text-center">
                    <Truck className="w-10 h-10 text-green-600 mb-2" />
                    <p className="font-semibold">Free Delivery</p>
                    <p className="text-xs text-gray-500">Above ₹5,000</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <RefreshCw className="w-10 h-10 text-green-600 mb-2" />
                    <p className="font-semibold">Easy Returns</p>
                    <p className="text-xs text-gray-500">30 Days Policy</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Shield className="w-10 h-10 text-green-600 mb-2" />
                    <p className="font-semibold">100% Original</p>
                    <p className="text-xs text-gray-500">Guaranteed</p>
                  </div>
                </div>

                {/* Add to Cart - Premium Button */}
                <div className="space-y-4">
                  <button
                    className={`w-full py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-4 ${
                      p.stock > 0
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={p.stock === 0}
                  >
                    <ShoppingCart className="w-7 h-7" />
                    {p.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>

                  <button className="w-full py-4 rounded-2xl border-2 border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 transition">
                    Buy Now
                  </button>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-3 text-green-600 font-semibold">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                  In Stock • Ready to ship
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section - Fully Clickable */}
      {relatedProducts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-gray-900">
                You May Also Like
              </h2>
              <Link
                href={`/category/${p.category.slug}`}
                className="text-indigo-600 font-medium hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {relatedProducts.map((item: any) => (
                <Link
                  key={item._id}
                  href={`/product/${item._id}`}
                  className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative aspect-square bg-gray-100">
                    <Image
                      src={item.thumbnail || item.images[0]?.url}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.stock < 5 && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Low Stock
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition">
                      {item.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xl font-bold text-indigo-600">
                        {item.price.toLocaleString()} {item.currency}
                      </span>
                    </div>
                    {item.tags[0] && (
                      <span
                        className="inline-block mt-3 px-3 py-1 text-xs font-medium text-white rounded-full"
                        style={{ backgroundColor: item.tags[0].color || "#6366f1" }}
                      >
                        {item.tags[0].name}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}