import fetch from 'node-fetch'
import fs from 'fs'
import { promisify } from 'util';
import { insertAssetPackageVersion } from './notion';
import { generateThumbnails } from './imaging';

const exec = promisify(require('child_process').exec);
const NPM_TOKEN = process.env.NPM_ACCESS_TOKEN
export const NEXT_STATIC_PATH = process.env.NEXT_STATIC_PATH || './out';

export const IMAGE_NPM_PACKAGE_NAME = 'kendrickzou-portfolio-img'
const NPM_MIRROR = 'https://npm.elemecdn.com'
export const IMAGE_NPM_PACKAGE_PATH =
  process.env.CDN_IMG_TMP_PATH || '.temp/image'

export const remoteVersion = async (pkgName: string) => {
  let remoteVersion: string
  try {
    const resp = await fetch(`https://registry.npmjs.org/${pkgName}/latest`)
    const respJson = await resp.json()
    remoteVersion = respJson.version
    if (!remoteVersion) {
      remoteVersion = '1.0.0'
    }
  } catch (err) {
    remoteVersion = '1.0.0'
    console.error(`Error in fetching remote version for: ${pkgName}}`)
    throw err
  }
  return remoteVersion
}

export const nextVersion = async (pkgName: string, version?: string) => {
  if (!version) {
    version = await remoteVersion(pkgName)
  }
  const remoteZ = Number(version.split(/[.-]/)[2])
  return `${version.split(/[.-]/)[0]}.${version.split(/[.-]/)[1]}.${
    remoteZ + 1
  }`
}

export const imageCDNUrl = (version: string, fileName: string) =>
  `${NPM_MIRROR}/${IMAGE_NPM_PACKAGE_NAME}@${version}/${fileName}`

export const publishImage = async (newVersion: string) => {
  // const nextVer = await nextVersion(IMAGE_NPM_PACKAGE_NAME)
  // const imgPkgIx = await imagePackageIndex()
  const packagePath = `${IMAGE_NPM_PACKAGE_PATH}/${newVersion}`
  let stagingList
  try {
    stagingList = await fs.promises.readdir(packagePath)
  } catch (err) {
    return {
      version: await remoteVersion(IMAGE_NPM_PACKAGE_NAME),
      msg: 'EMPTY',
    }
  }
  await Promise.all(
    stagingList.map((img) => insertAssetPackageVersion(img, newVersion))
  )
  // await fs.promises.writeFile(`${IMAGE_NPM_PACKAGE_PATH}/index.json`, JSON.stringify(Object.fromEntries(imgPkgIx)))
  await generateThumbnails(packagePath, stagingList)
  let pubRes = await publish(IMAGE_NPM_PACKAGE_NAME, packagePath, newVersion)
  await fs.promises.rm(packagePath, { recursive: true, force: true })
  return pubRes
}

export const publish = async (
  pkgName: string,
  pkgPath: string,
  newVersion: string
) => {
  const pkgJson = {
    name: pkgName,
    version: `${newVersion}`,
    description: '',
    main: 'index.js',
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    keywords: [],
    author: 'Kendrick Zou',
    license: 'ISC',
  }
  console.log(`New version number for ${pkgName}: ${pkgJson.version}`)
  await fs.promises.writeFile(
    pkgPath + '/package.json',
    JSON.stringify(pkgJson)
  )
  const { stdout, stderr } = await exec(
    `npm config set _authToken=${NPM_TOKEN} && npm publish`,
    { cwd: pkgPath }
  )
  console.log(`npm publish stdout: ${(stdout as string).trim()}`)
  return {
    version: pkgJson.version,
    msg: stdout as string,
  }
}
