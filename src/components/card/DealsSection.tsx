// components/card/DealsSection.tsx
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DealsSection() {
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});

  // Correct API with tags parameter
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?tags=70-off`,  // ← Fixed: tags=70-off
    fetcher,
    { revalidateOnFocus: false }
  );

  // Safely get the products array
  const products = data?.data || [];

  // Countdown Timer Effect
  useEffect(() => {
    if (products.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = { ...prev };

        products.forEach((product: any) => {
          const id = product._id;
          if (!updated[id]) {
            // Random time between 1-8 hours
            const totalSeconds = Math.floor(Math.random() * 28800) + 3600;
            const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
            const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
            const s = String(totalSeconds % 60).padStart(2, "0");
            updated[id] = `${h}:${m}:${s}`;
          } else {
            let [h, m, s] = updated[id].split(":").map(Number);
            if (s > 0) s--;
            else if (m > 0) {
              s = 59;
              m--;
            } else if (h > 0) {
              s = 59;
              m = 59;
              h--;
            }
            updated[id] = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [products]);

  // Loading State
  if (isLoading) {
    return (
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 py-4 min-w-max">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-64 h-80 bg-gray-200 rounded-xl animate-pulse shadow" />
          ))}
        </div>
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 text-lg font-medium">
        No 70% OFF deals available right now. Check back soon!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-6 py-4 min-w-max">
        {products.map((product: any) => {
          // Simulate original price for ~70% discount
          const originalPrice = Math.round(product.price / 0.3); // 70% off logic
          const discount = 70; // Or calculate dynamically

          return (
            <Link
              key={product._id}
              href={`/product/${product.slug || product._id}`}
              className="group block"
            >
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden w-64 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                {/* Product Image */}
                <div className="aspect-video relative">
                  <Image
                    src={product.thumbnail || product.images?.[0]?.url || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    sizes="256px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl animate-pulse">
                    {discount}% OFF
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-2 text-gray-800">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-2xl font-bold text-green-600">
                      RS {product.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 line-through text-sm">
                      RS {originalPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Countdown */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-600 font-medium">Deal ends in:</p>
                    <p className="text-xl font-mono font-bold text-red-600 tracking-wider">
                      {timeLeft[product._id] || "00:00:00"}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}