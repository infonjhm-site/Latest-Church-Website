import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
      {
        source: '/about/:path*',
        destination: '/about/:path*/index.html',
      },
      {
        source: '/ministry/:path*',
        destination: '/ministry/:path*/index.html',
      },
      {
        source: '/connect/:path*',
        destination: '/connect/:path*/index.html',
      },
      {
        source: '/account/:path*',
        destination: '/account/:path*/index.html',
      },
      {
        source: '/give/:path*',
        destination: '/give/:path*/index.html',
      },
      {
        source: '/contact',
        destination: '/contact/index.html',
      },
    ]
  },
};

export default nextConfig;
