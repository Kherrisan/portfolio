import type {
  GetPagePropertyResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import type { GetStaticProps, NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { FiArrowLeft, FiBookmark, FiMessageCircle } from 'react-icons/fi'
import { BiCategory } from 'react-icons/bi'
import { AiOutlineTag } from 'react-icons/ai'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import fs from 'fs'

import BlogCopyright from '../../components/BlogCopyright'
import BlogTableOfContent from '../../components/BlogTableOfContent'
import Comments from '../../components/Comments'
import probeImageSize, { downloadImage, imageHash, proxyStaticImage } from '../../lib/imaging'
import { getAssetPackageVersion, getBlocks, getDatabase, getPage, type PageCompletePropertyRecord } from '../../lib/notion'

import { unified } from 'unified'
import notionRehype from 'notion-rehype-k'
import rehypeReact from '../../components/RehypeReact'
import { ReactNode } from 'react'
import { imageCDNUrl, IMAGE_NPM_PACKAGE_NAME, IMAGE_NPM_PACKAGE_PATH, nextVersion } from '../../lib/npm'
import { imageFileName } from '../../lib/imaging'
import { Data } from 'vfile'
import { H1 } from '../../components/Header'
import { DateTime } from 'luxon'
import { HrStyle } from '../../components/Border'
import tw from 'twin.macro'
import { HeadingText } from '../../styles/global'
import { publishImage } from '../../lib/npm'

const Post: NextPage<{ page: PageObjectResponse; blocks: any[] }> = ({ page, blocks }) => {
  const router = useRouter()
  const hostname = 'https://kendrickzou.com'

  if (!page || !blocks) return <div />

  const emoji = page.icon?.type === 'emoji' ? page.icon.emoji : '🎑'
  const prop = page.properties as unknown as PageCompletePropertyRecord

  const name =
    'results' in prop.name && prop.name.results[0].type === 'title'
      ? prop.name.results[0].title.plain_text
      : ''
  const date = prop.date.type === 'date' ? prop.date.date?.start ?? '' : ''
  const authors = 'results' in prop.author ? prop.author.results : []
  const author = authors.length == 0 ? '_' : (
    'people' in authors[0] && 'name' in authors[0].people
      ? authors[0].people.name
      : '_'
  )
  const category = 'select' in prop.category ? prop.category.select : null
  const tags = 'multi_select' in prop.tags ? prop.tags.multi_select : []

  const headings = blocks
    .filter((b: any) => b.type === 'heading_2' || b.type === 'heading_3')
    .map((b: any) => {
      return {
        id: b.id,
        type: b.type,
        text: b[b.type].rich_text[0].plain_text,
        children: [],
      }
    })
  // const date = prop.date.type === 'date' ? prop.date.date?.start ?? '' : ''

  // const author = 'results' in prop.author ? prop.author.results : []
  // const category = 'select' in prop.category ? prop.category.select : null
  // const tags = 'multi_select' in prop.tags ? prop.tags.multi_select : []

  const st = Date.now()
  // enableBlockId = true
  let reactElems = unified()
    .use(notionRehype, { enableBlockId: true })
    .use(rehypeReact)
    .processSync({ data: blocks as unknown as Data }).result as ReactNode;
  console.log(` [notion-rehype-k] ${Date.now() - st}ms`)

  return (
    <>
      <Head>
        <title>
          KendrickZou
        </title>
      </Head>

      <div className="container mx-auto grid max-w-5xl grid-cols-12 px-6 lg:max-w-5xl">
        <div css={[HrStyle, tw`col-span-12 lg:col-span-9`]}>
          <div className="-mx-4 rounded p-4">
            <H1 css={[HrStyle]}>
              <span>{emoji}</span>
              <span className="font-bold">{name}</span>
            </H1>
            {/* <div className="secondary-text flex flex-wrap items-center gap-2 my-5">
              <span>{DateTime.fromISO(date).setZone('UTC+8').toFormat('yyyy-MM-dd')}</span>
              <span>·</span>
              <div>
                <BiCategory size={18} className="mr-1 inline" />
                <span>{category?.name?.toLowerCase()}</span>
              </div>
              <span>·</span>
              <Link className="hover-links" href="#comments-section" passHref>
                <FiMessageCircle size={18} className="mr-1 inline" />
                <span>comments</span>
              </Link>
            </div> */}

            {/* <div className="secondary-text flex flex-wrap items-center gap-2 mb-8">
              {tags?.map((tag: any) => (
                <span key={tag.id}>
                  <AiOutlineTag size={18} className="mr-1 inline" />
                  <span>{tag.name?.toLowerCase()}</span>
                </span>
              ))}
            </div> */}


            <article className="prose my-8 dark:prose-invert max-w-none">
              {
                reactElems
              }
            </article>

            {/* <BlogCopyright
              title={name}
              author={author}
              date={date}
              absoluteLink={`${hostname}/blog/${router.query.slug}`}
            /> */}
          </div>

          {/* <Link href="/blog" passHref>
            <div className="group mt-4 flex cursor-pointer items-center justify-between rounded border border-gray-400/30 p-4 hover:bg-light-200 hover:opacity-80 dark:hover:bg-dark-700 md:-mx-4">
              <span>cd /blog</span>
              <FiArrowLeft className="h-4 w-4 transition-all duration-150 group-hover:-translate-x-1" />
            </div>
          </Link> */}

        </div>
        <BlogTableOfContent blocks={blocks} prop={page.properties as unknown as PageCompletePropertyRecord} />
        <Comments />
      </div>
    </>
  )
}

export const getStaticPaths = async () => {
  const db = await getDatabase()
  return {
    paths: db.map((p: any) => ({
      params: { slug: p.properties.slug.results[0].rich_text.plain_text },
    })),
    fallback: 'blocking',
  }
}

interface Props extends ParsedUrlQuery {
  slug: string
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // res.setHeader('Cache-Control', 'max-age=0, s-maxage=60, stale-while-revalidate')
  const { slug } = params as Props

  const db = await getDatabase(slug)
  const post = db[0].id

  const page = await getPage(post)
  const { last_edited_time } = (page as any)

  // if json props exists, and the last_edited time is the same, return the old one.
  if (fs.existsSync(`${process.cwd()}/.next/server/pages/${slug}.json`)) {
    const oldProps = JSON.parse(fs.readFileSync(`${process.cwd()}/.next/server/pages/${slug}.json`, 'utf8'))
    if (oldProps.page.last_edited_time === last_edited_time) {
      console.log(` ${slug} has not been modified since last build. Skipping revalidation.`)
      return {
        props: oldProps,
        revalidate: 60,
      }
    }
  }
  // const blocks = await getBlocks(post)

  const imageBlocks: any[] = []

  const recursiveGetBlocks = async (blocks: any[]) => {
    return await Promise.all(
      blocks
        .map(async (b: any) => {
          if (b.type === 'image') { imageBlocks.push(b) }
          if (b.has_children) {
            let children = await getBlocks(b.id)
            children = await recursiveGetBlocks(children)
            b[b.type]['children'] = children
          }
          return b
        })
    )
  }

  let blocks = await getBlocks(post)
  blocks = await recursiveGetBlocks(blocks)

  // const imgPkgIx = await imagePackageIndex()
  const nextXYZ = await nextVersion(IMAGE_NPM_PACKAGE_NAME)
  const newVersion = `${nextXYZ}-${page.id.substring(0, 6)}`
  let addedImages = 0

  // Resolve all images' dimensions
  await Promise.all(
    // blocksWithChildren
    imageBlocks
      .filter((b: any) => b.type === 'image')
      .map(async (b) => {
        const { type } = b
        const value = b[type]
        let src = value.type === 'external' ? value.external.url : value.file.url
        let imgHashName = await imageFileName(src)
        // if (!imgPkgIx.has(imgHashName)) {
        const remoteVersion = await getAssetPackageVersion(imgHashName)
        if (!remoteVersion) {
          await downloadImage(src, `${IMAGE_NPM_PACKAGE_PATH}/${newVersion}`, imgHashName)
          value[value.type].url = imageCDNUrl(newVersion, imgHashName)
          addedImages += 1
        } else {
          value[value.type].url = imageCDNUrl(remoteVersion, imgHashName)
        }
        // src = await proxyStaticImage(src)
        const { width, height } = await probeImageSize(src)
        // const { width, height } = { width: 100, height: 100}
        value['dim'] = { width, height }
        b[type] = value
      })
  )

  if (addedImages > 0) {
    await publishImage(newVersion)
  }

  // return { props: { page, blocks: blocksWithChildren }, revalidate: 1 } // 1 hour
  return { props: { page, blocks: blocks } }
}

export default Post
