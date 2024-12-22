import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // images: {
  //   domains: ['lh3.googleusercontent.com', 'maps.gstatic.com', 'maps.google.com', 'lh5.googleusercontent.com'],
  // },
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
