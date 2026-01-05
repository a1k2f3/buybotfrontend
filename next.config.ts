import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  productionBrowserSourceMaps: false,

  images: {
    domains: ["res.cloudinary.com"],
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    workerThreads: false,
    cpus: 1,
    webpackMemoryOptimizations: true,
  },

  webpack: (config) => {
    config.cache = false;
    config.parallelism = 1;
    return config;
  },
};

export default nextConfig;
