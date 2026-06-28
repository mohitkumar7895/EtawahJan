/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    instrumentationHook: true,
    optimizePackageImports: ['lucide-react'],
    serverComponentsExternalPackages: [
      'tesseract.js',
      'sharp',
      'canvas',
      '@napi-rs/canvas',
      'pdfjs-dist',
      'pdf-lib',
      'archiver',
    ],
    // Force the Vercel build's nft tracer to include pdfjs-dist's bundled
    // assets (standard fonts + CMaps). Without these on disk at runtime,
    // pdfjs throws "Value is none of these types `String`, `Path`, `URL`."
    // the first time it tries to substitute a base-14 font.
    outputFileTracingIncludes: {
      '/api/converter/jobs': [
        './node_modules/pdfjs-dist/standard_fonts/**',
        './node_modules/pdfjs-dist/cmaps/**',
        './node_modules/pdfjs-dist/legacy/build/**',
      ],
    },
  },
  webpack: (config, { isServer }) => {
    // The `canvas` alias-to-false workaround is for *client-side* pdfjs-dist
    // bundles that try to import `canvas` at module top-level. We never want
    // that on the client. For the server we still allow real canvas pkgs.
    if (!isServer) {
      config.resolve.alias.canvas = false;
    }
    config.resolve.alias.encoding = false;
    if (isServer) {
      config.externals = config.externals || [];
      const optional = [
        'sharp',
        'canvas',
        '@napi-rs/canvas',
        'archiver',
        'bullmq',
        'ioredis',
      ];
      if (Array.isArray(config.externals)) {
        config.externals.push(...optional);
      }
    }
    return config;
  },
};

module.exports = nextConfig;
