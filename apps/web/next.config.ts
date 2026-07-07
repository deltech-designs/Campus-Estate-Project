import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@ems/shared'],
  outputFileTracingRoot: path.join(__dirname, '../../'),
  allowedDevOrigins: ['192.168.56.1', 'localhost', '127.0.0.1'],
  experimental: {
    optimizePackageImports: ['@tanstack/react-query'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // In development, proxies to localhost:5000. In production, proxies to the Render URL.
        destination: `${process.env.BACKEND_API_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;