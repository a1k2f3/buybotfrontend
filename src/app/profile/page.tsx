"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaUserEdit,
  FaCog,
  FaStar,
  FaHeart,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";

interface User {
  name: string;
  image: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulate fetching user data
    const fetchUser = async () => {
      const mockUser = {
        name: "Kamran Ahmed",
        image: "https://i.pravatar.cc/150?img=12", // Random profile image
      };
      setUser(mockUser);
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    // Clear token or session
    localStorage.removeItem("token");
    localStorage.removeItem("UserId");

    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <section className=" mt-20 min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-6 md:px-20">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* User Info */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            {user && (
              <img
                src={user.image}
                alt={user.name}
                // fill
                className="rounded-full object-cover border-4 border-blue-500 shadow-md"
              />
            )}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {user ? user.name : "Loading..."}
          </h2>
          <p className="text-gray-500 mt-2">Welcome to your profile dashboard</p>
        </div>

        {/* Profile Menu */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/profile/edit"
            className="flex items-center gap-4 bg-blue-50 hover:bg-blue-100 transition-all p-5 rounded-xl shadow-sm"
          >
            <FaUserEdit className="text-blue-600 text-2xl" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">Edit Profile</h3>
              <p className="text-sm text-gray-500">Update your personal details</p>
            </div>
          </Link>

          <Link
            href="/profile/settings"
            className="flex items-center gap-4 bg-blue-50 hover:bg-blue-100 transition-all p-5 rounded-xl shadow-sm"
          >
            <FaCog className="text-blue-600 text-2xl" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">Settings</h3>
              <p className="text-sm text-gray-500">Manage your preferences</p>
            </div>
          </Link>

          <Link
            href="/profile/reviews"
            className="flex items-center gap-4 bg-blue-50 hover:bg-blue-100 transition-all p-5 rounded-xl shadow-sm"
          >
            <FaStar className="text-blue-600 text-2xl" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">My Reviews</h3>
              <p className="text-sm text-gray-500">See your feedback and ratings</p>
            </div>
          </Link>

          <Link
            href="/profile/wishlist"
            className="flex items-center gap-4 bg-blue-50 hover:bg-blue-100 transition-all p-5 rounded-xl shadow-sm"
          >
            <FaHeart className="text-blue-600 text-2xl" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">Wishlist</h3>
              <p className="text-sm text-gray-500">Your saved products</p>
            </div>
          </Link>

          <Link
            href="/profile/addresses"
            className="flex items-center gap-4 bg-blue-50 hover:bg-blue-100 transition-all p-5 rounded-xl shadow-sm sm:col-span-2"
          >
            <FaHome className="text-blue-600 text-2xl" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">Addresses</h3>
              <p className="text-sm text-gray-500">Manage your shipping details</p>
            </div>
          </Link>
        </div>

        {/* Logout Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all shadow-md"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
