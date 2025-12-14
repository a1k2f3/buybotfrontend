// app/order-history/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Store {
  _id: string;
  name: string;
}

// Allow storeId to be either full object OR just string ID
interface OrderItem {
  productId: string;
  storeId: Store | string;   // This is the key fix!
  quantity: number;
  price: number;
  _id: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userID = localStorage.getItem("UserId")?.replace(/"/g, '');
    const token = localStorage.getItem("token");

    if (!token || !userID) {
      setError("Please log in to view your order history.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders?userId=${userID}`,
          {
            method: 'GET',
            cache: 'no-store',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
            localStorage.removeItem("UserId");
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
        <div className="text-red-600 text-xl text-center max-w-md">{error}</div>
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
    <div className="max-w-5xl mx-auto mt-10 px-4 py-8 mb-20">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        My Order History
      </h2>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Order ID: <span className="font-semibold text-gray-800">{order._id}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Placed on: {format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-5 py-2 rounded-full text-sm font-semibold ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="mt-3 text-2xl font-bold text-gray-900">
                    RS{order.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center py-5 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Product ID: {item.productId}
                    </p>

                    {/* This is the safe way to display store name */}
                    <p className="text-sm text-gray-600 mt-1">
                      Store:{' '}
                      <span className="font-bold text-indigo-600">
                        {typeof item.storeId === 'string'
                          ? 'FashionHub' // fallback or you can leave empty
                          : item.storeId?.name || 'Unknown Store'}
                      </span>
                    </p>

                    <p className="text-sm text-gray-600">
                      {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      RS{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-5 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Delivery Address</p>
                  <p className="text-gray-800">{order.shippingAddress.name}</p>
                  <p className="text-gray-600">{order.shippingAddress.phone}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-semibold text-gray-700 mb-2">Payment</p>
                  <p className="text-gray-800">{order.paymentMethod}</p>
                  <p>
                    Status:{' '}
                    <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
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