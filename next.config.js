/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk', '@upstash/redis', '@upstash/vector'],
  },
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Exclude hume packages from being analyzed during SSR
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('@humeai/voice-react')
    }
    return config
  },
}

module.exports = nextConfig
