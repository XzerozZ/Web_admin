import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow remote images from any HTTPS domain
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Add Proxy Rewrites for API Calls
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Matches '/api/anything'
        destination: 'http://localhost:5000/:path*', // Redirects to backend
      },
    ];
  },
};

export default nextConfig;
