// app/cart/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Trash2, Plus, Minus, Tag, Truck, Shield } from "lucide-react";

// Fake cart data (replace with your cart context/store later)
const initialCartItems = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones Pro",
    price: 4999,
    quantity: 1,
    image: "/api/placeholder/400/400",
    inStock: true,
  },
  {
    id: "2",
    name: "Smart Watch Series 8",
    price: 28999,
    quantity: 2,
    image: "/api/placeholder/400/400",
    inStock: true,
  },
  {
    id: "3",
    name: "Premium Leather Wallet",
    price: 1599,
    quantity: 1,
    image: "/api/placeholder/400/400",
    inStock: false,
  },
  {
    id: "4",
    name: "Premium Leather Wallet",
    price: 1599,
    quantity: 1,
    image: "/api/placeholder/400/400",
    inStock: false,
  },
  {
    id: "5",
    name: "Premium Leather Wallet",
    price: 1599,
    quantity: 1,
    image: "/api/placeholder/400/400",
    inStock: false,
  },
  {
    id: "6",
    name: "Premium Leather Wallet",
    price: 1599,
    quantity: 1,
    image: "/api/placeholder/400/400",
    inStock: false,
  },
];

export default function CartPage() {
  const [items, setItems] = useState(initialCartItems);
  const [coupon, setCoupon] = useState("");

  const updateQuantity = (id: string, change: number) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon === "SAVE10" ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto text-center px-6">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-8" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
          <Link href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-md p-6 flex gap-6 hover:shadow-lg transition">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-xl"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-2xl font-bold text-indigo-600 mt-2">
                    Rs{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-gray-100 transition"
                        disabled={item.quantity === 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-gray-100 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-2 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-green-600 font-bold">
                  <span>Discount {coupon === "SAVE10" ? "(SAVE10)" : ""}</span>
                  <span>-Rs{discount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-4">
                  <span>Total</span>
                  <span className="text-2xl text-indigo-600">₹{total.toLocaleString()}</span>
                </div>

                {/* Coupon */}
                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Apply
                    </button>
                  </div>
                  {coupon === "SAVE10" && (
                    <p className="text-green-600 text-sm mt-2">10% discount applied!</p>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="flex justify-center gap-6 py-6 border-t mt-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>100% Secure</span>
                  </div>
                </div>

                <Link href="/shop/checkout">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl py-5 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
                    Proceed to Checkout
                  </button>
                </Link>

                <Link href="/" className="block text-center text-indigo-600 hover:text-indigo-700 font-medium mt-4">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}