import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import { promisify } from 'util';
import { IMAGE_NPM_PACKAGE_NAME, IMAGE_NPM_PACKAGE_PATH, nextVersion, remoteVersion } from '../../lib/npm';
import { insertAssetPackageVersion } from '../../lib/notion';
import { generateThumbnails } from '../../lib/imaging';

const exec = promisify(require('child_process').exec);
const NPM_TOKEN = process.env.NPM_ACCESS_TOKEN
const NEXT_STATIC_PATH = process.env.NEXT_STATIC_PATH || '/Users/zoudikai/Workspace/portfolio/.next/static'

const publishImage = async () => {
    const nextVer = await nextVersion(IMAGE_NPM_PACKAGE_NAME)
    // const imgPkgIx = await imagePackageIndex()
    let waitingList
    try {
        waitingList = await fs.promises.readdir(IMAGE_NPM_PACKAGE_PATH)
    } catch (err) {
        return {
            version: await remoteVersion(IMAGE_NPM_PACKAGE_NAME),
            msg: 'EMPTY'
        }
    }
    await Promise.all(waitingList.map(img => insertAssetPackageVersion(img, nextVer)))
    // await fs.promises.writeFile(`${IMAGE_NPM_PACKAGE_PATH}/index.json`, JSON.stringify(Object.fromEntries(imgPkgIx)))
    await generateThumbnails(IMAGE_NPM_PACKAGE_PATH, waitingList)
    let pubRes = await publish(IMAGE_NPM_PACKAGE_NAME, IMAGE_NPM_PACKAGE_PATH)
    await fs.promises.rm(`${IMAGE_NPM_PACKAGE_PATH}`, { recursive: true, force: true })
    return pubRes
}

export const publish = async (pkgName: string, pkgPath: string) => {
    const remoteVer = await remoteVersion(pkgName)
    const remoteZ = Number(remoteVer.split('.')[2])
    const remoteXY = remoteVer.split('.')[0] + '.' + remoteVer.split('.')[1]
    const pkgJson = {
        "name": pkgName,
        "version": `${remoteXY}.${remoteZ + 1}`,
        "description": "",
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "keywords": [],
        "author": "Kendrick Zou",
        "license": "ISC"
    }
    console.log(`New version number for ${pkgName}: ${pkgJson.version}`)
    await fs.promises.writeFile(pkgPath + '/package.json', JSON.stringify(pkgJson))
    const { stdout, stderr } = await exec(`npm config set _authToken=${NPM_TOKEN} && npm publish`, { cwd: pkgPath })
    console.log(`npm publish stdout: ${(stdout as string).trim()}`)
    return {
        version: pkgJson.version,
        msg: stdout as string
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    console.log(`${req.method} /api/cdn`)
    if (req.method === 'GET') {
        // Get NextJS static package build ID
        const resp = await fetch('https://registry.npmjs.org/kendrickzou-portfolio/latest')
        try {
            const version = JSON.parse(await resp.text()).version
            res.status(200).json({
                version: version,
            })
        } catch (err) {
            res.status(400).json({
                msg: err
            })
        }
    } else if (req.method === 'POST') {
        // Trigger NextJS static package publish
        const pubRes = await Promise.all([
            publishImage(),
            publish('kendrickzou-portfolio', NEXT_STATIC_PATH)
        ])
        // publish('kendrickzou-portfolio', NEXT_STATIC_PATH),
        res.status(200).json(pubRes)
    } else {
        res.status(400).json({
            msg: 'Unsupported HTTP method'
        })
    }
}
