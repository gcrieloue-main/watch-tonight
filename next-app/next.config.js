/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'production'
            ? 'http://back:3001/:path*'
            : 'http://localhost:3001/:path*',
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.themoviedb.org',
        port: '',
        pathname: '**',
      },
    ],
  },

  output: 'standalone',
}

module.exports = nextConfig
