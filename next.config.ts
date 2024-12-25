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
};

export default nextConfig;
