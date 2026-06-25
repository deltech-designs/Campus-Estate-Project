import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@ems/shared'],
  outputFileTracingRoot: path.join(__dirname, '../../'),
  experimental: {
    // Optimise package imports for better tree-shaking
    optimizePackageImports: ['@tanstack/react-query'],
  },
};

export default nextConfig;
