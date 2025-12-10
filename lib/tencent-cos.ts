// @ts-ignore - COS SDK 类型定义可能不完整
import COS from 'cos-nodejs-sdk-v5'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { insertAssetPackageVersion } from './notion'
import { generateThumbnails } from './imaging'

const exec = promisify(require('child_process').exec)

// 腾讯云 COS 配置
const COS_SECRET_ID = process.env.TENCENT_COS_SECRET_ID
const COS_SECRET_KEY = process.env.TENCENT_COS_SECRET_KEY
const COS_BUCKET = process.env.TENCENT_COS_BUCKET || 'portfolio-images-1234567890'
const COS_REGION = process.env.TENCENT_COS_REGION || 'ap-guangzhou'
const COS_DOMAIN = process.env.TENCENT_COS_DOMAIN || `${COS_BUCKET}.cos.${COS_REGION}.myqcloud.com`
// 如果配置了自定义域名或CDN域名，使用自定义域名
const COS_CDN_DOMAIN = process.env.TENCENT_COS_CDN_DOMAIN || `https://${COS_DOMAIN}`

export const NEXT_STATIC_PATH = process.env.NEXT_STATIC_PATH || './out'
export const IMAGE_TEMP_PATH = process.env.CDN_IMG_TMP_PATH || '.temp/images'

// 初始化 COS 客户端
const cosClient = new COS({
  SecretId: COS_SECRET_ID,
  SecretKey: COS_SECRET_KEY,
})

/**
 * 检查文件是否已存在于 COS
 * @param key 文件在 COS 中的 key（路径）
 * @returns 是否存在
 */
export const checkFileExists = async (key: string): Promise<boolean> => {
  try {
    await cosClient.headObject({
      Bucket: COS_BUCKET!,
      Region: COS_REGION,
      Key: key,
    })
    return true
  } catch (err: any) {
    if (err.statusCode === 404) {
      return false
    }
    throw err
  }
}

/**
 * 上传单个文件到 COS
 * @param localPath 本地文件路径
 * @param fileName 文件名（不含路径）
 * @returns 上传结果
 */
export const uploadFile = async (localPath: string, fileName: string) => {
  // 所有图片上传到 images/ 目录下
  const key = `images/${fileName}`
  
  return new Promise((resolve, reject) => {
    cosClient.uploadFile(
      {
        Bucket: COS_BUCKET!,
        Region: COS_REGION,
        Key: key,
        FilePath: localPath,
        // 设置缓存策略（1年）
        CacheControl: 'max-age=31536000',
      },
      (err: any, data: any) => {
        if (err) {
          console.error(`[ERROR] Failed to upload ${localPath} to COS:`, err)
          reject(err)
        } else {
          console.info(`[INFO] Successfully uploaded to COS: ${key}`)
          resolve(data)
        }
      }
    )
  })
}

/**
 * 检查图片是否已处理（在 COS 中是否存在所有必需的文件）
 * @param imageHashName 图片哈希名称
 * @returns 是否已处理
 */
export const isImageProcessed = async (imageHashName: string): Promise<boolean> => {
  try {
    // 检查原图和 @1x 缩略图是否存在（作为已处理的标志）
    const nameWithoutExt = imageHashName.split('.')[0]
    const ext = imageHashName.split('.')[1]
    
    // 检查 images/ 目录下的 @1x.jpeg 文件
    const exists = await checkFileExists(`images/${nameWithoutExt}@1x.jpeg`)
    return exists
  } catch (err) {
    console.error(`Error checking if image is processed: ${imageHashName}`, err)
    return false
  }
}

/**
 * 生成 COS 文件的 CDN URL
 * @param fileName 文件名（包含扩展名）
 * @returns CDN URL
 */
export const imageCDNUrl = (fileName: string) => {
  // 所有图片都存储在 images/ 目录下
  return `${COS_CDN_DOMAIN}/images/${fileName}`
}

/**
 * 处理单张图片：生成缩略图并上传到 COS
 * @param imagePath 图片本地路径
 * @param imageHashName 图片哈希名称
 * @returns 上传成功的文件列表
 */
export const processAndUploadImage = async (
  imagePath: string,
  imageHashName: string
) => {
  const folderPath = path.dirname(imagePath)
  const fileName = path.basename(imagePath)

  console.log(`[INFO] Processing image: ${imageHashName}`)

  // 1. 生成缩略图（@1x/@2x/@3x 和 WebP 格式）
  console.log('[INFO] Generating thumbnails...')
  await generateThumbnails(folderPath, [fileName])

  // 2. 获取所有生成的文件（原图 + 缩略图）
  const allFiles = await fs.promises.readdir(folderPath)
  const imageFiles = allFiles.filter((file) => {
    // 找出与当前图片相关的所有文件
    const nameWithoutExt = imageHashName.split('.')[0]
    return file.startsWith(nameWithoutExt)
  })

  console.log(`[INFO] Uploading ${imageFiles.length} files to COS...`)

  // 3. 上传所有相关文件到 COS 的 images/ 目录
  const uploadedFiles: string[] = []
  await Promise.all(
    imageFiles.map(async (file) => {
      const localFilePath = path.join(folderPath, file)
      try {
        // uploadFile 函数会自动添加 images/ 前缀
        await uploadFile(localFilePath, file)
        uploadedFiles.push(file)
      } catch (err) {
        console.error(`Failed to upload ${file}:`, err)
        throw err
      }
    })
  )

  console.log(`[INFO] Successfully uploaded ${uploadedFiles.length} files`)

  // 4. 清理本地临时文件
  for (const file of imageFiles) {
    const filePath = path.join(folderPath, file)
    await fs.promises.unlink(filePath)
  }
  console.log('[INFO] Cleaned up temporary files')

  return uploadedFiles
}

/**
 * 从 COS 删除指定版本的所有文件（可选功能）
 * @param version 版本号
 */
export const deleteVersion = async (version: string) => {
  return new Promise((resolve, reject) => {
    cosClient.deleteMultipleObject(
      {
        Bucket: COS_BUCKET!,
        Region: COS_REGION,
        Objects: [],
      },
      (err: any, data: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      }
    )
  })
}

/**
 * 获取 COS 中的文件列表（可选功能，用于调试）
 * @param prefix 前缀（目录）
 */
export const listFiles = async (prefix: string = '') => {
  return new Promise((resolve, reject) => {
    cosClient.getBucket(
      {
        Bucket: COS_BUCKET!,
        Region: COS_REGION,
        Prefix: prefix,
      },
      (err: any, data: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      }
    )
  })
}

