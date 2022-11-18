import { Client } from '@notionhq/client'
import moment from 'moment-timezone'
import type {
  GetPagePropertyResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { retry } from 'ts-retry-promise'

export type PageCompletePropertyResponse = {
  id: string
} & GetPagePropertyResponse
export type PageCompletePropertyRecord = Record<
  string,
  PageCompletePropertyResponse
>
export type LatestPostProps = {
  private: boolean
  title: string
  slug: string
  emoji: string
} | null

const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId =
  process.env.NOTION_DATABASE_ID || 'b3f55ea317de4af39aefcab597bcf7d5'
const tweetDatabaseId =
  process.env.NOTION_TWEET_DATABASE_ID || '3d75457bd05b4072a8bd322b6f5eec65'

const propExtractor = async (propId: string, pageId: string) => {
  const prop = await notion.pages.properties.retrieve({
    page_id: pageId,
    property_id: propId,
  })
  if (!('results' in prop)) return ''
  return prop.results.map((r: any) => r[r.type].plain_text).join('')
}

const getPageProperty = async (pageId: string, propId: string) => {
  return await retry(
    () =>
      notion.pages.properties.retrieve({
        page_id: pageId,
        property_id: propId,
      }),
    { retries: 5 }
  )
}

export const getTweets = async () => {
  let dbQuery: any = {
    database_id: tweetDatabaseId,
    sorts: [{ property: 'date', direction: 'descending' }],
  }
  const { results } = await notion.databases.query(dbQuery)
  return results.map((r: any) => ({
    id: r.id,
    datetime: moment(r.created_time).tz("Asia/Shanghai").format('YYYY-MM-DD HH:mm:ss'),
    content: r.properties.content.rich_text[0]?.plain_text
  }))
}

export const getDatabase = async (slug?: string) => {
  let dbQuery: any = {
    database_id: databaseId,
    filter: { and: [{ property: 'published', checkbox: { equals: true } }] },
    sorts: [{ property: 'date', direction: 'descending' }],
  }

  if (slug) {
    dbQuery.filter.and.push({ property: 'slug', rich_text: { equals: slug } })
  }

  const { results } = await notion.databases.query(dbQuery)

  // Each result (post) contains properties that should be extracted
  // Props include - { published, tag, slug, author, date, preview, name }
  await Promise.all(
    results.map(async (res) => {
      if ('properties' in res) {
        for (const prop in res.properties) {
          if (res.properties.hasOwnProperty(prop)) {
            const propId = res.properties[prop].id
            const propObj = await getPageProperty(res.id, propId)

            // Dumping every property into the result object as there is much
            // to take care of (which will happen in React)
            res.properties[prop] = { id: propId, ...propObj }
          }
        }
      }

      return res
    })
  )

  return results
}

export const getLatestPostProps = async (privateAccessable: boolean = false) => {
  try {
    const { results } = await notion.databases.query({
      database_id: databaseId,
      filter: { and: [{ property: 'published', checkbox: { equals: true } }, { property: 'private', checkbox: {equals: privateAccessable}}] },
      sorts: [{ property: 'date', direction: 'descending' }],
      page_size: 1,
    })

    const post = results[0]
    if (!('icon' in post && 'properties' in post)) return null

    const emoji = post.icon?.type === 'emoji' ? post.icon.emoji : '📝'
    const privateProps = await notion.pages.properties.retrieve({
      page_id: post.id,
      property_id: 'private',
    }) as { checkbox: boolean}

    const slug = await propExtractor(post.properties.slug.id, post.id)
    const title = await propExtractor(post.properties.name.id, post.id)
    return {
      private: privateProps.checkbox,
      emoji,
      slug,
      title,
    } as LatestPostProps
  } catch (error) {
    return null
  }
}

export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId })

  if ('properties' in response) {
    for (const prop in response.properties) {
      if (response.properties.hasOwnProperty(prop)) {
        const propId = response.properties[prop].id
        const propObj = await getPageProperty(response.id, propId)

        // Same as the above implementation
        response.properties[prop] = { id: propId, ...propObj }
      }
    }
  }
  return response
}

export const getBlocks = async (blockId: string) => {
  const blocks = []
  let cursor
  while (true) {
    const { results, next_cursor }: ListBlockChildrenResponse =
      await notion.blocks.children.list({
        start_cursor: cursor,
        block_id: blockId,
      })

    blocks.push(...results)
    if (!next_cursor) break
    cursor = next_cursor
  }
  return blocks
}

export const searchDatabase = async (query: string) => {
  const response = await notion.search({
    query: query,
    filter: { value: 'page', property: 'object' },
    page_size: 10,
  })
  return response.results
}
