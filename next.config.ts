import type { NextConfig } from "next";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    unoptimized: true,
  },

  /*
  # INFO: adjust before deploy

  For Github static page zesp11 organization
  basePath: '/zesp11_page',
  assetPrefix: '/zesp11_page',

  For Github static page fork
  basePath: '/zesp11.github.io',
  assetPrefix: '/zesp11.github.io',

  For local static page
  basePath: '/pz2024/zesp11',
  assetPrefix: '/pz2024/zesp11',
   */
  basePath: '',
  assetPrefix: '',
};

export default nextConfig;
