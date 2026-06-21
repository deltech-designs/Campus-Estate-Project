import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ems/shared'],
  experimental: {
    // Optimise package imports for better tree-shaking
    optimizePackageImports: ['@tanstack/react-query'],
  },
};

export default nextConfig;
