import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // add Cloudinary domain here
  },
};

export default nextConfig;
