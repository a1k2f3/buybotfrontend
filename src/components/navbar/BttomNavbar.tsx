"use client";
import React from "react";
import { FaHome, FaShoppingBag, FaShoppingCart, FaUserAlt } from "react-icons/fa";

const BottomNavbar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg z-50">
      <div className="flex justify-around items-center py-2 text-sm font-medium">
        {/* Home */}
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-all">
          <FaHome size={22} />
          <span className="text-xs mt-1">Home</span>
        </button>

        {/* Shop */}
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-all">
          <FaShoppingBag size={22} />
          <span className="text-xs mt-1">Shop</span>
        </button>

        {/* Cart */}
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-all relative">
          <FaShoppingCart size={22} />
          <span className="text-xs mt-1">Cart</span>
          {/* 🔴 Notification badge (optional) */}
          <span className="absolute -top-1 right-3 bg-red-500 text-white text-[10px] rounded-full px-1.5">
            3
          </span>
        </button>

        {/* Account */}
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-all">
          <FaUserAlt size={22} />
          <span className="text-xs mt-1">Account</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavbar;
