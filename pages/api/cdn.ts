// import type { NextApiRequest, NextApiResponse } from 'next'


// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse<any>
// ) {
//     console.log(`${req.method} /api/cdn`)
//     if (req.method === 'GET') {
//         // Get NextJS static package build ID
//         const resp = await fetch('https://registry.npmjs.org/kendrickzou-portfolio/latest')
//         try {
//             const version = JSON.parse(await resp.text()).version
//             res.status(200).json({
//                 version: version,
//             })
//         } catch (err) {
//             res.status(400).json({
//                 msg: err
//             })
//         }
//     } else if (req.method === 'POST') {
//         // Trigger NextJS static package publish
//         const pubRes = await Promise.all([
//             publishImage(),
//             publish('kendrickzou-portfolio', NEXT_STATIC_PATH)
//         ])
//         // publish('kendrickzou-portfolio', NEXT_STATIC_PATH),
//         res.status(200).json(pubRes)
//     } else {
//         res.status(400).json({
//             msg: 'Unsupported HTTP method'
//         })
//     }
// }

const noop = () => {}
export default noop