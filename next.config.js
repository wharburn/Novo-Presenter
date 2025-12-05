/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk', '@upstash/redis', '@upstash/vector'],
  },
  output: 'standalone',
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
}

module.exports = nextConfig
