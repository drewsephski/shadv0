import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // output: 'export',
  basePath: isProd ? '/shadv0' : '',
  assetPrefix: isProd ? 'https://drewsephski.github.io/shadv0/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
