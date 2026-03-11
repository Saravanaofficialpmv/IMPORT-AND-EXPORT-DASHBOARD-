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
  // Exclude prisma from the build
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('prisma');
    }
    return config;
  },
};

module.exports = nextConfig;
