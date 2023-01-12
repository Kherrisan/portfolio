/** @type {import('next').NextConfig} */
const { merge } = require('webpack-merge')
const path = require('path')

module.exports = {
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   if (isServer) {
  //     return merge(config, {
  //       entry() {
  //         return config.entry().then((entry) => {
  //           return Object.assign({}, entry, { 'image.worker': path.resolve(process.cwd(), 'workers/image.worker.ts') })
  //         })
  //       }
  //     });
  //   } else {
  //     return config;
  //   }
  // },
  reactStrictMode: true,
  images: {
    // unoptimized: true,
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
  },
  async redirects() {
    return [
      {
        source: '/posts/index.xml',
        destination: '/feed',
        permanent: false,
      },
      {
        source: '/feed.xml',
        destination: '/feed',
        permanent: false,
      },
    ]
  },
}
