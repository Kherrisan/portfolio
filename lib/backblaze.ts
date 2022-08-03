import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import axios from 'axios'

const B2_REGION = 'us-west-004'
const B2_ENDPOINT = `s3.${B2_REGION}.backblazeb2.com`
const B2_BUCKET = 'bucket-kendrickzou'
const B2_CF_HOST = 'b2.kendrickzou.com'

const s3 = new S3Client({
  region: B2_REGION,
  endpoint: `https://${B2_ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!!,
  },
})

/**
 *  Check whether the image is stored in Backblaze B2.
 *
 * @param img The transformed image name extracted from the URL in NotionBlock, e.g. '760779c9-c07d-44ce-a575-b964f771c09c-Untitled.png'. Note that the image name is the same as the file name in Backblaze B2, whose back slash is replaced with a dash.
 * @returns The URL of the image in Backblaze B2 if it is stored in Backblaze B2, otherwise returns null.
 */
export const probeImageInB2 = async (img: string) => {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: B2_BUCKET, Key: img }))
    return `https://${B2_CF_HOST}/${img}`
  } catch (err) {
    // If the image is not stored in Backblaze B2, s3.send will throw an error(40x).
    // Thus return null.
  }
  return null
}

/**
 * Fetch the image from url and store it in Backblaze B2.
 *
 * @param url The URL of the image in NotionBlock.
 * @param img The transformed image name.
 * @returns The URL of the image in Backblaze B2. Or url if error occurs.
 */
export const storeImage2B2 = async (url: string, img: string) => {
  let resp
  try {
    resp = await axios.get(url, {
      responseType: 'arraybuffer',
      decompress: false,
    })
  } catch (err) {
    console.error(`[ERROR] Failed to fetch notion-image from ${url} ${err}`)
    return url
  }
  try {
    const uploading = new Upload({
      client: s3,
      params: {
        Bucket: B2_BUCKET,
        Key: img,
        Body: resp.data,
        ContentType: resp.headers['content-type'],
      },
    })
    await uploading.done()
    console.info(`[INFO] Successfully uploaded to Backblaze: ${img}`)
    return `https://${B2_CF_HOST}/${img}`
  } catch (err) {
    console.error(err)
  }
  return url
}
