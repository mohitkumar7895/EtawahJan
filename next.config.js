/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverComponentsExternalPackages: [
      'tesseract.js',
      'sharp',
      'canvas',
      'pdf-lib',
      'archiver',
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    if (isServer) {
      config.externals = config.externals || [];
      const optional = ['sharp', 'canvas', 'archiver', 'bullmq', 'ioredis'];
      if (Array.isArray(config.externals)) {
        config.externals.push(...optional);
      }
    }
    return config;
  },
};

module.exports = nextConfig;
