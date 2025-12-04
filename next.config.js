/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk', '@upstash/redis', '@upstash/vector'],
  },
}

module.exports = nextConfig
