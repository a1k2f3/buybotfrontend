import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // add Cloudinary domain here
  },
  eslint: {
    // This removes the info message completely
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optional: also silence TS errors during build (if you want)
    ignoreBuildErrors: false,
  },
  
};

export default nextConfig;
