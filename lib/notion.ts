import { Client } from '@notionhq/client'
import moment from 'moment-timezone'
import type {
  GetPagePropertyResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { retry } from 'ts-retry-promise'
import { loadEnvConfig } from '@next/env'
import { HttpsProxyAgent } from 'https-proxy-agent'
import fetch from 'node-fetch'

loadEnvConfig(process.cwd())

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

// 配置代理
const createNotionClient = () => {
  const proxyUrl = process.env.NOTION_PROXY_URL || process.env.HTTPS_PROXY || process.env.HTTP_PROXY
  
  // 使用新版本 API (2025-09-03)
  // 新版本引入了数据源（DataSource）的概念，将数据库容器与数据表分离
  
  if (proxyUrl) {
    const agent = new HttpsProxyAgent(proxyUrl)
    
    // 在 SDK 5.x 中，可以直接传递 agent 参数
    return new Client({
      auth: process.env.NOTION_KEY,
      agent,
    })
  }
  
  // 没有配置代理时使用默认配置
  console.log(`[INFO] Notion API version: 2025-09-03 (default)`)
  return new Client({ 
    auth: process.env.NOTION_KEY,
  })
}

const notion = createNotionClient()
const databaseId =
  process.env.NOTION_DATABASE_ID || '80f855f1-07f1-4626-8961-023570f13467'
const tweetDatabaseId =
  process.env.NOTION_TWEET_DATABASE_ID || '3d75457bd05b4072a8bd322b6f5eec65'
const assetPackageDatabaseId =
  process.env.NOTION_ASSET_PACKAGE_DATABASE_ID || 'f2e0ae9f9ec34304be9b1df6c15a2696'

const propExtractor = async (propId: string, pageId: string) => {
  const prop = await notion.pages.properties.retrieve({
    page_id: pageId,
    property_id: propId,
  })
  if (!('results' in prop)) return ''
  return prop.results.map((r: any) => r[r.type].plain_text).join('')
}

const getPageProperty = async (pageId: string, propId: string): Promise<any> => {
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
  // 使用新版本 API: dataSources.query 替代 databases.query
  let dbQuery: any = {
    data_source_id: tweetDatabaseId, // 参数名从 database_id 改为 data_source_id
    sorts: [{ property: 'date', direction: 'descending' }],
  }
  const { results } = await notion.dataSources.query(dbQuery)
  return results.map((r: any) => ({
    id: r.id,
    datetime: moment(r.created_time).tz("Asia/Shanghai").format('YYYY-MM-DD HH:mm:ss'),
    content: r.properties.content.rich_text[0]?.plain_text
  }))
}

export const getDatabase = async (slug?: string) => {
  // 使用新版本 API: dataSources.query 替代 databases.query
  let dbQuery: any = {
    data_source_id: databaseId, // 参数名从 database_id 改为 data_source_id
    filter: { and: [{ property: 'published', checkbox: { equals: true } }] },
    sorts: [{ property: 'date', direction: 'descending' }],
  }

  if (slug) {
    dbQuery.filter.and.push({ property: 'slug', rich_text: { equals: slug } })
  }

  const { results } = await notion.dataSources.query(dbQuery)

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
            // 使用临时变量绕过类型检查和编译器限制
            const properties: any = res.properties
            properties[prop] = { id: propId, ...propObj }
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
    // 使用新版本 API: dataSources.query 替代 databases.query
    const { results } = await notion.dataSources.query({
      data_source_id: databaseId, // 参数名从 database_id 改为 data_source_id
      filter: { and: [{ property: 'published', checkbox: { equals: true } }, { property: 'private', checkbox: { equals: privateAccessable } }] },
      sorts: [{ property: 'date', direction: 'descending' }],
      page_size: 1,
    })

    const post = results[0]
    if (!('icon' in post && 'properties' in post)) return null

    const emoji = post.icon?.type === 'emoji' ? post.icon.emoji : '📝'
    const privateProps = await notion.pages.properties.retrieve({
      page_id: post.id,
      property_id: 'private',
    }) as { checkbox: boolean }

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
        // 使用临时变量绕过类型检查和编译器限制
        const properties: any = response.properties
        properties[prop] = { id: propId, ...propObj }
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

export const getAssetPackageVersion = async (assetName: string) => {
  // 使用新版本 API: dataSources.query 替代 databases.query
  const { results } = await notion.dataSources.query({
    data_source_id: assetPackageDatabaseId, // 参数名从 database_id 改为 data_source_id
    filter: {
      property: 'name',
      title: {
        equals: assetName
      }
    }
  })
  if (results.length == 0) return null
  const { properties } = results[0] as { properties: {} }
  const { version } = properties as { version: { rich_text: { text: { content: string } }[] } }
  return version.rich_text[0].text.content
}

export const getLatestPackageVersion = async () => {
  // 使用新版本 API: dataSources.query 替代 databases.query
  const { results } = await notion.dataSources.query({
    data_source_id: assetPackageDatabaseId, // 参数名从 database_id 改为 data_source_id
    sorts: [{
      property: 'version',
      direction: 'descending'
    }],
    page_size: 1
  })
  if (results.length == 0) return '1.0.0'
  const { properties } = results[0] as { properties: {} }
  const { version } = properties as { version: { rich_text: { text: { content: string } }[] } }
  return version.rich_text[0].text.content
}

export const insertAssetPackageVersion = async (assetName: string, assetVersion: string) => {
  await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: assetPackageDatabaseId
    },
    properties: {
      name: {
        title: [{
          text: { content: assetName }
        }]
      },
      version: {
        rich_text: [{
          text: { content: assetVersion }
        }]
      }
    }
  })
}

export const getAssetCount = async () => {
  return 0;
}