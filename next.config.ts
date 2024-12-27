import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['https://5e794ca2e8862a9aa01f71d22a4bc140.r2.cloudflarestorage.com',"pub-0d09e9dbdb334949bc64fece4edb6ce5.r2.dev", "https://rjtraditional.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
