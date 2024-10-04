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
};

export default nextConfig;