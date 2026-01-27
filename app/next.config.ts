import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Image Optimization - Next.js 16 Best Practices */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  /* Performance Optimizations */
  compress: true,
  poweredByHeader: false,

  /* React 19 Optimizations */
  reactStrictMode: true,

  /* Experimental Features (Next.js 16) */
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
};

export default nextConfig;
