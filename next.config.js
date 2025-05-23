/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost']
  },
  trailingSlash: true,
  distDir: '.next',
  webpack: (config, { dev, isServer }) => {
    config.cache = { type: 'memory' };
    return config;
  }
};

module.exports = nextConfig;