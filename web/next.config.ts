import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  env: {
    BASE_API: process.env.BASE_API
  }
};

export default nextConfig;
