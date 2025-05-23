/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  images: { 
    unoptimized: true,
    domains: ['localhost']
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  webpack: (config, { dev, isServer }) => {
    config.cache = { type: 'memory' };
    return config;
  },
};

module.exports = nextConfig;