/** @type {import('next').NextConfig} */
const { merge } = require('webpack-merge')

module.exports = {
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: [
      'avatars.githubusercontent.com',
      'avatars0.githubusercontent.com',
      'avatars1.githubusercontent.com',
      'avatars2.githubusercontent.com',
      'avatars3.githubusercontent.com',
      's3.bmp.ovh',
      'i1.hdslb.com',
      'i2.hdslb.com',
      'b2.kendrickzou.com',
      'cdn.bilicdn.tk'
    ],
    formats: ['image/webp'],
    deviceSizes: [640, 1080, 1200, 1920, 2560],
    imageSizes: [256]
  }
}
