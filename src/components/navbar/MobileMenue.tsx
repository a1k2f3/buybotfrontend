import React from "react";
import Link from "next/link";

const MobileMenu: React.FC = () => {
  const links = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="md:hidden bg-white border-t shadow-md">
      <div className="flex flex-col space-y-3 py-4 px-4">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
