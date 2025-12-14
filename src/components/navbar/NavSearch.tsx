"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

const NavSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Only navigate if query is not empty (after trimming)
    if (query.trim()) {
      // Navigate to search results page with query as URL param
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      
      // Optional: clear the input after search
      setQuery("");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full max-w-md bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 shadow-sm transition-all"
    >
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
      />
      <button
        type="submit"
        className="text-gray-600 hover:text-blue-600 transition-colors ml-2"
        aria-label="Search"
      >
        <FaSearch size={18} />
      </button>
    </form>
  );
};

export default NavSearch;