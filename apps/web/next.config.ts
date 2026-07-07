import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@ems/shared'],
  outputFileTracingRoot: path.join(__dirname, '../../'),
  allowedDevOrigins: ['192.168.56.1', 'localhost', '127.0.0.1'],
  experimental: {
    // Optimise package imports for better tree-shaking
    optimizePackageImports: ['@tanstack/react-query'],
  },
};

export default nextConfig;
