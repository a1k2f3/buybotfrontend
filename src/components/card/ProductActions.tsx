'use client'; // Make it a client component for interactivity

import { useEffect, useState } from "react";
import { ShoppingCart, Heart, Share2, Copy, Shield, Truck, Check } from "lucide-react";

export default function ProductActions({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out ${product.name} - Only ${product.price} RS!`;

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem('token');
    const userID=localStorage.getItem('UserId')?.replace(/"/g, "") // Token from login
console.log("Using token:", token);
console.log("Using UserID:", userID);
    if (!token) {
      setError('Please login to add to cart');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add?userId=${userID}
`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send token here
        },
        body: JSON.stringify({
          productId: product._id, // Use product's actual ID
          quantity,
          storeId: product.brand?._id || "",
          
          // Use current quantity state
        })
      });
console.log(product._id)
console.log(quantity)
console.log("ehuh",product.brand?._id || "")
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const data = await response.json();
      setSuccess(true);
      console.log(data); // For debugging
      // Optional: Update global cart state or redirect
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
// useEffect
  return (
    <div className="space-y-6">
      {/* Quantity + Buttons */}
      <div className="flex items-stretch gap-3">
        <div className="flex items-center border rounded-lg">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-gray-100">-</button>
          <span className="px-6 font-semibold text-lg">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-gray-100">+</button>
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={loading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <ShoppingCart className="w-6 h-6" /> 
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>

        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-lg hover:shadow-xl transition">
          Buy Now
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">Added to cart successfully!</p>}

      {/* Wishlist & Share */}
      <div className="flex gap-3">
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 font-medium transition ${
            wishlisted ? "bg-red-50 border-red-400 text-red-600" : "border-gray-300 hover:border-red-400"
          }`}
        >
          <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
          {wishlisted ? "Wishlisted" : "Wishlist"}
        </button>

        <div className="relative group">
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-300 hover:border-indigo-500 transition">
            <Share2 className="w-5 h-5" /> Share
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-xl border shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`)}>
              WhatsApp
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3" onClick={() => window.open(`https://facebook.com/sharer?u=${shareUrl}`)}>
              Facebook
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3" onClick={() => { navigator.clipboard.writeText(shareUrl); alert("Copied!"); }}>
              <Copy className="w-4 h-4" /> Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t">
        {["100% Authentic", "Free Delivery", "7 Days Return"].map((text, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="p-3 bg-green-100 rounded-full mb-2">
              {i === 0 && <Shield className="w-6 h-6 text-green-600" />}
              {i === 1 && <Truck className="w-6 h-6 text-green-600" />}
              {i === 2 && <Check className="w-6 h-6 text-green-600" />}

            </div>
            <span className="text-sm font-medium text-gray-700">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}