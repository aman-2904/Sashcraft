import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
