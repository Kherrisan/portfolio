import axios from 'axios'
import probe from 'probe-image-size'
import fs from 'fs'
import crypto from 'crypto'
import util from 'util'
const exec = util.promisify(require('child_process').exec)

import { probeImageInB2, storeImage2B2 } from './backblaze'
import { Md5 } from 'ts-md5'

const IMAGE_SCALE_FACTORS = [
  '@1x',
  '@2x',
  '@3x'
]
const IMAGE_BASE_WIDTH = 768
const BIN = 'convert'

export const generateThumbnails = async (folder: string, imgs: string[]) => {
  let pArr: Promise<{ stdout: string, stderr: string }>[] = []
  console.log(imgs)
  for (let i in imgs) {
    let img = imgs[i]
    const imgTokens = img.split('.')
    const { stdout } = await exec(`identify -format "%w \\n" ${img}`, { cwd: folder })
    const imgWidth = Number(stdout)
    Array.from({length: 3}, (x, i) => i).map(f => {
      const scaledWidth = (f + 1) * IMAGE_BASE_WIDTH
      const w = scaledWidth > imgWidth ? imgWidth : scaledWidth
      pArr.push(exec(`${BIN} "${img}" -auto-orient -resize ${w}x "${imgTokens[0]}${IMAGE_SCALE_FACTORS[f]}.jpeg"`, { cwd: folder }) as Promise<{ stdout: string, stderr: string }>)
    })
  }
  await Promise.all(pArr)
}

export const imageHash = async (file: string) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha1');
    const stream = fs.createReadStream(file);
    stream.on('error', err => reject(err));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

export const imageFileName = async (url: string) => {
  const matches = url.match(/[\w-]+\.(jpg|png|jpeg|webp|heic|avif)/g)
  if (matches && matches.length > 0 && matches.at(0)) {
    // image is uploaded as a file to notion
    const urlObj = new URL(url)
    // url pathname contains: block id and file name
    return Md5.hashStr(urlObj.pathname) + '.' + matches.at(0)!.split('.')[1]
  }
  // else: image is embeded as external src
  let resp
  try {
    resp = await axios({
      url: url,
      method: 'HEAD'
    })
  } catch (err) {
    console.error(`Error fetching content-type of: ${url}`)
    console.error(err)
    throw (err)
  }
  const t = resp.headers['content-type']!
  const ext = t.split('/')[1]
  return `${Md5.hashStr(url)}.${ext}`
}

export const downloadImage = async (url: string, dir: string, img: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  let resp
  try {
    resp = await axios({
      url: url,
      method: 'GET',
      responseType: 'stream'
    })
  } catch (err) {
    console.error(`Error in fetching ${url}`)
    console.error(err)
    throw err
  }
  const writer = fs.createWriteStream(`${dir}/${img}`)
  resp.data.pipe(writer)
  return new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

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
    // Replace backslash with dash in the image name.
    // So as not to be misinterpreted as a directory.
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
