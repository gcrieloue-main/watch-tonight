/** @type {import('next').NextConfig} */

const serverUrl = process.env.SERVER_URL || 'http://back:3001'
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'production'
            ? serverUrl + '/:path*'
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
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '**',
      },
    ],
  },

  output: 'standalone',
}

module.exports = nextConfig
