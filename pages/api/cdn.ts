import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import moment from 'moment'
import { promisify } from 'util';

const exec = promisify(require('child_process').exec);
const NPM_TOKEN = process.env.NPM_ACCESS_TOKEN
const CDN_PACKAGE_JSON = {
    "name": "kendrickzou-portfolio",
    "version": "1.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "Kendrick Zou",
    "license": "ISC"
}
const NEXT_STATIC_PATH = '/Users/zoudikai/Workspace/portfolio/.next/static'

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
                date: moment(Number(version.split('.')[2])).format('YYYY-MM-DD hh:mm:ss')
            })
        } catch (err) {
            res.status(400).json({
                msg: err
            })
        }
    } else if (req.method === 'POST') {
        // Trigger NextJS static package publish
        const pkgJsonCopy = JSON.parse(JSON.stringify(CDN_PACKAGE_JSON))
        const version = pkgJsonCopy.version + `.${Date.now()}`
        pkgJsonCopy.version = version
        console.log(`new version number: ${version}`)
        await fs.promises.writeFile(NEXT_STATIC_PATH + '/package.json', JSON.stringify(pkgJsonCopy))
        const { stdout, stderr } = await exec(`npm config set _authToken=${NPM_TOKEN} && npm publish`, { cwd: NEXT_STATIC_PATH })
        console.log(`npm publish stdout: ${stdout}`)
        res.status(200).json({
            msg: 'OK',
            version: version,
            date: moment(Number(version.split('.')[2])).format('YYYY-MM-DD hh:mm:ss')
        })
    } else {
        res.status(400).json({
            msg: 'Unsupported HTTP method'
        })
    }
}
