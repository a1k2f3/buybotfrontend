"use client";

export default function Footer() {
  return (
    <footer className="bg-blue-50 text-gray-600 text-center py-6 border-t mt-auto">
      <p className="text-sm">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-600">BuyBot</span> — Connecting Customers & Vendors Smarter.
      </p>
    </footer>
  );
}
