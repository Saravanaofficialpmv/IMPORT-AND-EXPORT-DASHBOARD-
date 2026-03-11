/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  typescript: {
    // TypeScript errors won't block the build
    ignoreBuildErrors: false,
  },
  eslint: {
    // ESLint warnings won't block the build
    ignoreDuringBuilds: false,
  },
  // Configure Turbopack (Next.js 16 default bundler)
  turbopack: {},
};

module.exports = nextConfig;
