"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Truck,
  Shield,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle,
  X,
} from "lucide-react";

type Step = "address" | "payment" | "review";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  storeId: string;
  inStock: boolean;
}

interface Address {
  _id?: string;
  id: string | number;
  type: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  name: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("address");
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [coupon, setCoupon] = useState("");
  const [items, setItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add New Address Modal
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    type: "home" as "home" | "work" | "other",
    street: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
    isDefault: false,
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const getToken = () => localStorage.getItem("token");
  const getUserId = () => localStorage.getItem("UserId")?.replace(/"/g, "");

  // Fetch Cart Items
  const fetchCart = async () => {
    setLoading(true);
    const token = getToken();
    const userID = getUserId();
console.log("UserID in fetchCart:", userID);
console.log("Token in fetchCart:", token);
    if (!token || !userID) {
      setError("Please login to proceed with checkout");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/cart?userId=${userID}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
console.log("Cart Data:", data);
      const populatedItems: CartItem[] = data.items.map((item: any) => ({
        id: item.productId._id.toString(),
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        storeId: item.storeId || "",
        image: item.productId.thumbnail || "/api/placeholder/400/400",
        inStock: item.productId.inStock ?? true,
      }));

      setItems(populatedItems);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Addresses - GET /api/users/addresses/:id
  const fetchAddresses = async () => {
    const token = getToken();
    const userID = getUserId();
    if (!token || !userID) return;

    try {
      const response = await fetch(`${API_BASE}/api/users/addresses/${userID}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to fetch addresses");
      }

      const data = await response.json();

      // Backend returns { addresses: [...] } or direct array
      const addrList = Array.isArray(data) ? data : data.addresses || [];

      const mapped: Address[] = addrList.map((addr: any) => ({
        _id: addr._id,
        id: addr._id,
        type: addr.type || "home",
        street: addr.street || "",
        apartment: addr.apartment || "",
        city: addr.city || "",
        state: addr.state || "",
        postalCode: addr.postalCode || "",
        country: addr.country || "Pakistan",
        isDefault: addr.isDefault || false,
        name: addr.name || "Home Address",
        phone: addr.phone || "",
      }));

      setAddresses(mapped);

      // Auto-select default address
      const defaultIdx = mapped.findIndex((a) => a.isDefault);
      if (defaultIdx !== -1) setSelectedAddressIndex(defaultIdx);
      else if (mapped.length > 0) setSelectedAddressIndex(0);
    } catch (err: any) {
      console.error("Error fetching addresses:", err);
      setError(err.message);

      // Fallback dummy data
      setAddresses([
        {
          id: "fallback-1",
          type: "home",
          street: "House #123, Street 45",
          apartment: "",
          city: "Lahore",
          state: "Punjab",
          postalCode: "54000",
          country: "Pakistan",
          isDefault: true,
          name: "Kamran Ali",
          phone: "03001234567",
        },
      ]);
    }
  };

  // Add New Address - POST /api/users/addresses/:id
  const handleAddAddress = async () => {
    const token = getToken();
    const userID = getUserId();

    if (!token || !userID) {
      setError("You must be logged in to add an address");
      return;
    }

    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode || !newAddress.name || !newAddress.phone) {
      setError("Please fill all required fields");
      return;
    }

    const payload = {
      type: newAddress.type,
      street: newAddress.street,
      apartment: newAddress.apartment || undefined,
      city: newAddress.city,
      state: newAddress.state,
      postalCode: newAddress.postalCode,
      country: newAddress.country,
      isDefault: newAddress.isDefault,
    };

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/users/addresses/${userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to add address");
      }

      await response.json();

      // Refresh addresses
      await fetchAddresses();

      // Reset form & close modal
      setNewAddress({
        name: "",
        phone: "",
        type: "home",
        street: "",
        apartment: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Pakistan",
        isDefault: false,
      });
      setShowAddAddress(false);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Checkout / Create Order
  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    const token = getToken();
    const userID = getUserId();

    if (!token || !userID) {
      setError("Please login to proceed");
      setLoading(false);
      return;
    }

    const selectedAddr = addresses[selectedAddressIndex];
    if (!selectedAddr) {
      setError("Please select or add a delivery address");
      setLoading(false);
      return;
    }

    const payload = {
      shippingAddress: {
        name: selectedAddr.name,
        phone: selectedAddr.phone,
        address: `${selectedAddr.street}${selectedAddr.apartment ? ", " + selectedAddr.apartment : ""}`,
        city: selectedAddr.city,
        state: selectedAddr.state,
        postalCode: selectedAddr.postalCode,
        country: selectedAddr.country,
      },
      paymentMethod:
        paymentMethod === "cod"
          ? "Cash on Delivery"
          : paymentMethod === "upi"
          ? "UPI"
          : "Card",
    };

    try {
      const response = await fetch(`${API_BASE}/api/orders?userId=${userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }
console.log(response);
      router.push("/shop/order-success");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon === "WELCOME50" ? 500 : 0;
  const delivery = subtotal > 999 ? 0 : 79;
  const total = subtotal - discount + delivery;

  const steps = [
    { id: "address", label: "Delivery Address", icon: Truck },
    { id: "payment", label: "Payment Method", icon: CreditCard },
    { id: "review", label: "Review & Pay", icon: CheckCircle },
  ];

  // Loading / Empty / Error States
  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <Link href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order in a few simple steps</p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-12 overflow-x-auto">
          <div className="flex items-center gap-8 py-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isDone = ["address", "payment", "review"].indexOf(step) > i;
              return (
                <div key={s.id} className="flex items-center shrink-0">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                      isDone || isActive ? "bg-indigo-600 text-white" : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {isDone ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <p className={`ml-3 font-medium ${isActive ? "text-indigo-600" : "text-gray-600"} whitespace-nowrap`}>
                    {s.label}
                  </p>
                  {i < steps.length - 1 && (
                    <div className={`w-24 h-1 mx-4 ${isDone ? "bg-indigo-600" : "bg-gray-300"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Steps */}
          <div className="lg:col-span-2 space-y-8">
            {/* Address Step */}
            {step === "address" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Select Delivery Address</h2>

                <div className="space-y-4">
                  {addresses.map((addr, idx) => (
                    <label
                      key={addr.id}
                      className={`block p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedAddressIndex === idx
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressIndex === idx}
                          onChange={() => setSelectedAddressIndex(idx)}
                          className="mt-1 w-5 h-5 text-indigo-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-lg">
                              {addr.name} ({addr.type.charAt(0).toUpperCase() + addr.type.slice(1)})
                            </h4>
                            {addr.isDefault && (
                              <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mt-1">
                            {addr.street}
                            {addr.apartment && `, ${addr.apartment}`}, {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <p className="text-gray-600">Phone: {addr.phone}</p>
                        </div>
                      </div>
                    </label>
                  ))}

                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition font-medium text-lg"
                  >
                    + Add New Address
                  </button>
                </div>

                <button
                  onClick={() => setStep("payment")}
                  disabled={addresses.length === 0}
                  className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-5 rounded-xl text-lg transition shadow-lg"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Choose Payment Method</h2>
                <div className="space-y-4">
                  {[
                   
              
                    { id: "cod", label: "Cash on Delivery", icon: Wallet },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300"
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
                  <button
                    onClick={() => setStep("address")}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("review")}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition shadow-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {step === "review" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold mb-3">Delivery Address</h3>
                    <p className="font-medium">{addresses[selectedAddressIndex]?.name}</p>
                    <p className="text-gray-600">
                      {addresses[selectedAddressIndex]?.street}
                      {addresses[selectedAddressIndex]?.apartment && `, ${addresses[selectedAddressIndex]?.apartment}`},{" "}
                      {addresses[selectedAddressIndex]?.city} - {addresses[selectedAddressIndex]?.postalCode}
                    </p>
                    <p className="text-gray-600">Phone: {addresses[selectedAddressIndex]?.phone}</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold mb-3">Payment Method</h3>
                    <p className="font-medium capitalize">
                      {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "upi" ? "UPI" : "Card"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep("payment")}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-xl text-xl transition shadow-lg disabled:opacity-70"
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </button>
                </div>

                {error && <p className="text-red-600 text-center mt-4 font-medium">{error}</p>}
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-2">{item.name}</h4>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-bold text-indigo-600">RS{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t pt-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>RS{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount {coupon === "WELCOME50" && "(WELCOME50)"}</span>
                  <span>RS{discount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery {delivery === 0 && <span className="text-green-600 font-bold">FREE</span>}</span>
                  <span>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 border-t pt-4">
                  <span>Total</span>
                  <span className="text-indigo-600">RS{total.toLocaleString("en-IN")}</span>
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
                {coupon === "WELCOME50" && (
                  <p className="text-green-600 text-sm mt-2 text-center">₹500 discount applied!</p>
                )}
              </div>

              <div className="flex justify-center gap-6 mt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>100% Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      {showAddAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add New Address</h3>
              <button
                onClick={() => setShowAddAddress(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="Street Address *"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500 md:col-span-2"
                required
              />
              <input
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                value={newAddress.apartment}
                onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500 md:col-span-2"
              />
              <input
                type="text"
                placeholder="City *"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="State / Province *"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="Postal Code *"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
              <select
                value={newAddress.type}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, type: e.target.value as "home" | "work" | "other" })
                }
                className="px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>

              <label className="flex items-center gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
                <span className="text-gray-700">Set as default address</span>
              </label>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAddAddress(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-4 rounded-xl font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAddress}
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition disabled:opacity-70"
              >
                {loading ? "Saving..." : "Save Address"}
              </button>
            </div>

            {error && <p className="text-red-600 text-center mt-4 font-medium">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}