"use client";
import React, { useState } from "react";
import NavLogo from "./NavbarLogo";
import NavLinks from "./NavLinks";
import NavActions from "./Navaction";
import MobileMenu from "./MobileMenue";
import NavSearch from "./NavSearch";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
        {/* Logo */}
        <NavLogo />

        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <NavSearch />
        </div>

        {/* Links + Actions (Desktop) */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks />
          <NavActions />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && <MobileMenu />}
    </nav>
  );
};

export default Navbar;
