import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
