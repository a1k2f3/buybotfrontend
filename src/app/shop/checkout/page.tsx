// app/checkout/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Truck, Shield, CreditCard, Smartphone, Wallet, ChevronRight, CheckCircle } from "lucide-react";

type Step = "address" | "payment" | "review";

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("address");
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [coupon, setCoupon] = useState("");

  // Fake data
  const addresses = [
    { id: 0, name: "Rahul Sharma", phone: "9876543210", address: "123, MG Road, Bangalore", pincode: "560001", isDefault: true },
    { id: 1, name: "Priya Singh", phone: "9123456789", address: "Flat 402, Green View Apartments, Mumbai", pincode: "400001", isDefault: false },
  ];

  const cartItems = [
    { id: "1", name: "Wireless Headphones Pro", price: 4999, qty: 1, image: "/api/placeholder/200/200" },
    { id: "2", name: "Smart Watch Series 8", price: 28999, qty: 2, image: "/api/placeholder/200/200" },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = coupon === "WELCOME50" ? 500 : 0;
  const delivery = subtotal > 999 ? 0 : 79;
  const total = subtotal - discount + delivery;

  const steps = [
    { id: "address", label: "Delivery Address", icon: Truck },
    { id: "payment", label: "Payment Method", icon: CreditCard },
    { id: "review", label: "Review & Pay", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order in a few simple steps</p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isDone = ["address", "payment", "review"].indexOf(step) > i;

              return (
                <div key={s.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${isDone || isActive ? "bg-indigo-600 text-white" : "bg-gray-300 text-gray-600"}`}>
                    {isDone ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <div className="ml-3">
                    <p className={`font-medium ${isActive ? "text-indigo-600" : "text-gray-600"}`}>{s.label}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-24 h-1 mx-4 ${isDone ? "bg-indigo-600" : "bg-gray-300"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Side - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Address */}
            {step === "address" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Select Delivery Address</h2>
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedAddress === addr.id ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-1 w-5 h-5 text-indigo-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-lg">{addr.name}</h4>
                            {addr.isDefault && <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">Default</span>}
                          </div>
                          <p className="text-gray-700 mt-1">{addr.address}, {addr.pincode}</p>
                          <p className="text-gray-600">Phone: {addr.phone}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 text-gray-600 hover:border-indigo-400 transition">
                    + Add New Address
                  </button>
                </div>
                <button
                  onClick={() => setStep("payment")}
                  className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-xl text-lg transition shadow-lg"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === "payment" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Choose Payment Method</h2>
                <div className="space-y-4">
                  {[
                    { id: "upi", label: "UPI (Google Pay, PhonePe, etc.)", icon: Smartphone },
                    { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                    { id: "cod", label: "Cash on Delivery", icon: Wallet },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === method.id ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="w-5 h-5 text-indigo-600"
                        />
                        <Icon className="w-8 h-8 text-gray-700" />
                        <span className="font-medium text-lg">{method.label}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep("address")} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition">
                    Back
                  </button>
                  <button onClick={() => setStep("review")} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition shadow-lg">
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === "review" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold mb-3">Delivery Address</h3>
                    <p className="font-medium">{addresses[selectedAddress].name}</p>
                    <p className="text-gray-600">{addresses[selectedAddress].address}, {addresses[selectedAddress].pincode}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold mb-3">Payment Method</h3>
                    <p className="font-medium capitalize">{paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "upi" ? "UPI" : "Card"}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep("payment")} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition">
                    Back
                  </button>
                  <Link href="order-success">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-xl text-xl transition shadow-lg transform hover:scale-105">
                    checkout Now
                  </button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover rounded-lg" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-2">{item.name}</h4>
                      <p className="text-gray-600">Qty: {item.qty}</p>
                      <p className="font-bold text-indigo-600">Rs{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t pt-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount {coupon === "WELCOME50" ? "(WELCOME50)" : ""}</span>
                  <span>-Rs{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery {delivery === 0 && <span className="text-green-600 font-bold">FREE</span>}</span>
                  <span>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 border-t pt-4">
                  <span>Total</span>
                  <span className="text-indigo-600">Rs{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
                {coupon === "WELCOME50" && <p className="text-green-600 text-sm mt-2 text-center">₹500 discount applied!</p>}
              </div>

              <div className="flex justify-center gap-6 mt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-green-600" /><span>Fast Delivery</span></div>
                <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-green-600" /><span>100% Secure</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}