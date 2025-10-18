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
      className="hidden md:flex items-center w-full max-w-md bg-gray-100 rounded-full px-4 py-1 focus-within:ring-2 focus-within:ring-blue-500"
    >
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm text-gray-700"
      />
      <button type="submit" className="text-gray-600 hover:text-blue-600">
        <FaSearch size={16} />
      </button>
    </form>
  );
};

export default NavSearch;
