import type { NextConfig } from 'next';
import path from 'path';

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'https://campus-estate-api.onrender.com');

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
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;