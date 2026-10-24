import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/customizerstudio',
        destination: '/CustomizerStudio',
      },
      {
        source: '/customizer-studio',
        destination: '/CustomizerStudio',
      },
    ];
  },
};

export default nextConfig;
