"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
// useRouter
// Updated interfaces to match your populated API response
interface Product {
  _id: string;
  name: string;
  images: { url: string }[];
  price?: number; // optional since we have price in item
}

interface Store {
  _id: string;
  name: string;
  address?: string;
  city?: string;
  contactNumber?: string;
}

interface OrderItem {
  productId: Product;
  storeId: Store;
  quantity: number;
  price: number;
  _id: string;
}

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  country?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: ShippingAddress;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const router=useRouter()
  useEffect(() => {
    const userID = localStorage.getItem("UserId")?.replace(/"/g, "");
    const token = localStorage.getItem("token");

    if (!token || !userID) {
      router.push('/auth/login')
      setError("Please log in to view your order history.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders?userId=${userID}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
            localStorage.removeItem("UserId");
          } else {
            setError("Failed to fetch orders.");
          }
          setOrders([]);
          return;
        }

        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-xl text-center max-w-md px-4">{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Order History</h2>
        <p className="text-gray-600 text-lg">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 py-8 mb-20">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
        My Order History
      </h2>

      <div className="space-y-10">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                <div>
                  <p className="text-sm text-gray-600">
                    Order ID: <span className="font-mono font-bold text-gray-900">{order._id}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Placed on: {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-6 py-3 rounded-full text-sm font-bold tracking-wide ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="mt-4 text-3xl font-extrabold text-gray-900">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="p-8">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row gap-6 py-6 border-b border-gray-100 last:border-0"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {item.productId.images && item.productId.images.length > 0 ? (
                      <Image
                        src={item.productId.images[0].url}
                        alt={item.productId.name}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.productId.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Store:{" "}
                      <span className="font-bold text-indigo-600">
                        {item.storeId?.name}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Quantity: <span className="font-bold">{item.quantity}</span> × ₹
                      {item.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right sm:text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="font-bold text-gray-700 mb-3 text-lg">Delivery Address</p>
                  <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                  <p className="text-gray-600">{order.shippingAddress.phone}</p>
                  <p className="text-gray-600 mt-2">
                    {order.shippingAddress.address},<br />
                    {order.shippingAddress.city} - {order.shippingAddress.pincode}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-bold text-gray-700 mb-3 text-lg">Payment Details</p>
                  <p className="text-gray-800 capitalize">{order.paymentMethod}</p>
                  <p className="mt-2">
                    Status:{" "}
                    <span
                      className={`font-bold ${
                        order.paymentStatus === "Paid"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}