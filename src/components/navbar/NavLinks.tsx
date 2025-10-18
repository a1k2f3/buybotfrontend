import React from "react";
import Link from "next/link";

const NavLinks: React.FC = () => {
  const links = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          {link.name}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
