import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // IMPORTANT for low-memory servers

  productionBrowserSourceMaps: false,

  images: {
    domains: ["res.cloudinary.com"],
    unoptimized: true, // 🔥 CRITICAL FIX
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    webpackMemoryOptimizations: true,
    workerThreads: false, // 🔥 STOP parallel workers
    cpus: 1,              // 🔥 LIMIT CPU usage
  },

  webpack: (config) => {
    config.cache = false; // 🔥 reduce memory spikes
    // Disable heavy minimization during server build to avoid OOM on low-memory hosts
    config.optimization = config.optimization || {};
    config.optimization.minimize = false;
    return config;
  },
};

export default nextConfig;
