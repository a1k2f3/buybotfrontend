"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  stock: number;
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  thumbnail: string;
  images: { url: string }[];
  category?: { name: string } | null;
  brand?: { name: string } | null;
  tags: { name: string; color?: string }[];
}

interface SearchResponse {
  success: boolean;
  query: string;
  count: number;
  total?: number;
  data: Product[];
}

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [results, setResults] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 20;

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/search?q=${encodeURIComponent(
            query
          )}&page=${currentPage}&limit=${limit}`
        );
        const data: SearchResponse = await res.json();

        setResults(data.data || []);
        setTotalResults(data.total || data.count); // fallback to count if total not provided
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage]);

  const totalPages = Math.ceil(totalResults / limit);

  const updatePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Search Results for: <span className="text-blue-600">"{query}"</span>
      </h1>
      <p className="text-gray-600 mb-8">
        {loading ? "Searching..." : `${totalResults} products found`}
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {results.map((product) => (
              <Link
                key={product._id}
                href={`/product/${product._id}`}
                className="group block"
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        Low Stock
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Out of Stock</span>
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>

                    {product.category && (
                      <p className="text-sm text-gray-500 mt-1">
                        {product.category.name}
                      </p>
                    )}

                    <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Tags */}
                    {product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {product.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700"
                            style={{ backgroundColor: tag.color || "#f3f4f6" }}
                          >
                            {tag.name}
                          </span>
                        ))}
                        {product.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{product.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {product.currency} {product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => updatePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => updatePage(pageNum)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => updatePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600 mb-4">
            No products found for "<span className="font-semibold">{query}</span>"
          </p>
          <p className="text-gray-500">Try searching with different keywords.</p>
        </div>
      )}
    </div>
  );
}