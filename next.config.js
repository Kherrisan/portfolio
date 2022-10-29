/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'avatars0.githubusercontent.com',
      'avatars1.githubusercontent.com',
      'avatars2.githubusercontent.com',
      'avatars3.githubusercontent.com',
      's3.bmp.ovh',
      'i1.hdslb.com',
      'i2.hdslb.com',
      'b2.kendrickzou.com'
    ],
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
