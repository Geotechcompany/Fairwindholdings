/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    // Force case-sensitive path resolution
    config.resolve.symlinks = false;
    return config;
  },
  images: {
    domains: ["localhost"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "nmx3wm8j-3000.euw.devtunnels.ms"],
    },
  },
};

export default nextConfig;
