import probe from 'probe-image-size'

import { probeImageInB2, storeImage2B2 } from './backblaze'

const probeImageSize = async (url: string) => {
  const dim = await probe(url)
  return { width: dim.width, height: dim.height }
}

const S3_REG = new RegExp(
  '^https://s3..+?.amazonaws.com/secure.notion-static.com/(.+?)\\?'
)

export const proxyStaticImage = async (url: string) => {
  let notion_img: string
  try {
    notion_img = S3_REG.exec(url)![1].replace('/', '-')
  } catch (err) {
    return url
  }
  const imgInB2 = await probeImageInB2(notion_img)
  if (imgInB2) {
    return imgInB2
  }
  let proxied_url = await storeImage2B2(url, notion_img)
  return proxied_url ? proxied_url : url
}

export default probeImageSize
