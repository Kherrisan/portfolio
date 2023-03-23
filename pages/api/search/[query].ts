import type { NextApiRequest, NextApiResponse } from 'next'

import { searchDatabase } from '../../../lib/notion'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { query } = req.query
  // console.log(`Searching for ${query}`)
  const results = await searchDatabase(query as string)
  // console.log(`Found ${results}`)
  res.revalidate('1m')

  res.status(200).json(results)
}
