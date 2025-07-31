/** @type {import('next').NextConfig} */
const withNextIntl = require("next-intl/plugin")("./i18n.ts");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  // Disable static export due to internationalization issues
  output: undefined,
  trailingSlash: false,
  // Disable webpack cache to prevent chunk loading errors
  webpack: (config, { isServer }) => {
    // Disable persistent caching
    config.cache = false;

    // Add webpack optimizations to prevent chunk issues
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }

    return config;
  },
  // Increase memory limits
  experimental: {
    // Reduce memory usage by limiting workers
    workerThreads: false,
    cpus: 1,
  },
  // Disable source maps in development to reduce memory usage
  productionBrowserSourceMaps: false,
  // Reduce build memory usage
  swcMinify: true,
};

module.exports = withNextIntl(nextConfig);
