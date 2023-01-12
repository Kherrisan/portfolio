import { promisify } from "util";
import fs from 'fs'
import axios from "axios";
import { getLatestPackageVersion } from "./notion";

export const IMAGE_NPM_PACKAGE_NAME = 'kendrickzou-portfolio-img'

const NPM_MIRROR = 'https://cdn.bilicdn.tk/npm'
export const IMAGE_NPM_PACKAGE_PATH = process.env.CDN_IMG_TMP_PATH || '/Users/zoudikai/.portfolio/image'

export const remoteVersion = async (pkgName: string) => {
    let remoteVersion: string
    try {
        const resp = await fetch(`https://registry.npmjs.org/${pkgName}/latest`)
        const respJson = await resp.json()
        remoteVersion = respJson.version
        if (!remoteVersion) {
            remoteVersion = '1.0.0'
        }
    } catch {
        remoteVersion = '1.0.0'
    }
    return remoteVersion
}

export const nextVersion = async (pkgName: string, version?: string) => {
    if (!version) {
        if (pkgName === IMAGE_NPM_PACKAGE_NAME) {
            version = await getLatestPackageVersion()
        } else {
            version = await remoteVersion(pkgName);
        }
    }
    const remoteZ = Number(version.split('.')[2])
    return `${version.split('.')[0]}.${version.split('.')[1]}.${remoteZ + 1}`
}

// export const imagePackageIndex = async () => {
//     const v = await getLatestPackageVersion()
//     try {
//         const resp = await fetch(`${NPM_MIRROR}/${IMAGE_NPM_PACKAGE_NAME}@${v}/index.json`)
//         const json = await resp.json()
//         return new Map<string, string>(Object.entries(json))
//     } catch (err) {
//         console.error(`Error in fetching image package index`)
//         console.error(err)
//         return new Map
//     }
// }

export const imageCDNUrl = (version: string, fileName: string) =>
    `${NPM_MIRROR}/${IMAGE_NPM_PACKAGE_NAME}@${version}/${fileName}`

// const { stdout } = await exec(`magick identify -format "%w \n" ${fileName}`)
        // const width = Number(stdout)
        // const promises = THUMBNAIL_WIDTHS.map(w => {
        //     const prefix = fileName.split('.')[0]
        //     const suffix = fileName.split('.')[1]
        //     // logo-256.jpg, logo-512.jpg
        //     return exec(`magick ${fileName} -quality 75 -auto-orient -thumbnail ${w}x ${prefix}-${w}.${suffix}`, { cwd: this.pkgPath })
        // })
        // await Promise.all(promises)
        // console.log(`Compressed image: ${fileName}`)