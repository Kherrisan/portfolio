import type { NextApiRequest, NextApiResponse } from 'next'
import { promisify } from 'util'
import { NEXT_STATIC_PATH, nextVersion, publish } from '../../lib/npm'

const exec = promisify(require('child_process').exec)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.query.secret !== process.env.NEXT_REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }
  const { slug } = req.query
  try {
    await res.revalidate(`/blog/${slug}`)
    console.log(`Revalidated /blog/${slug} triggered by ${req.url}`)
    await exec(`yarn export`)
    const publishResult = await publish(
      'kendrickzou-portfolio',
      NEXT_STATIC_PATH,
      await nextVersion('kendrickzou-portfolio')
    )
    return res.json({ revalidated: true, ...publishResult })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: (err as any).message })
  }
}
