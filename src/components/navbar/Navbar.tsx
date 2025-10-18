"use client";
import React from "react";
import NavLogo from "./NavbarLogo";
import NavLinks from "./NavLinks";
import NavActions from "./Navaction";
import MobileMenu from "./MobileMenue";
import NavSearch from "./NavSearch";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      {/* 🔹 Desktop Layout */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 py-3 justify-between items-center gap-4">
        {/* Logo (hidden on mobile) */}
        <NavLogo />

        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <NavSearch />
        </div>

        {/* Links + Actions */}
        <div className="flex items-center space-x-8">
          <NavLinks />
          <NavActions />
        </div>
      </div>

      {/* 🔹 Mobile Layout */}
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </nav>
  );
};

export default Navbar;
