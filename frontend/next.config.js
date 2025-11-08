/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@splinetool/react-spline'],
  images: {
    domains: ['prod.spline.design'],
  },
  // Enable App Router features
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: [],
  },
  // Optimize for performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // For better debugging
  webpack: (config) => {
    config.devtool = 'source-map';
    return config;
  },
};

module.exports = nextConfig;
