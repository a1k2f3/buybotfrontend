"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const NavSearch: React.FC = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 shadow-sm"
    >
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm text-gray-700"
      />
      <button type="submit" className="text-gray-600 hover:text-blue-600 transition-all">
        <FaSearch size={18} />
      </button>
    </form>
  );
};

export default NavSearch;
