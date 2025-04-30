import type { NextConfig } from "next";

const basePath = "/realtime-chat"
const nextConfig: NextConfig = {
  basePath: basePath,
  reactStrictMode: false,
  env: {
    BASE_API: process.env.BASE_API
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: basePath,
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
