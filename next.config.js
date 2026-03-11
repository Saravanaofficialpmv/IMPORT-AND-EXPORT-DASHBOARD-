/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  // Configure Turbopack (Next.js 16 default bundler)
  turbopack: {},
};

module.exports = nextConfig;
