import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { GetStaticProps, NextPage } from 'next'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { AiOutlineTag } from 'react-icons/ai'
import { BiCategory } from 'react-icons/bi'
import { BiSearch } from 'react-icons/bi'
import { DateTime } from "luxon";

import Head from 'next/head'

import { H1, H2, Heading } from '../components/Header'
import { Link } from '../components/Link'
import { PrivateContext } from '../components/PrivateToggle'
import SearchModal from '../components/SearchModal'
import { type PageCompletePropertyRecord, getDatabase } from '../lib/notion'
import { HrStyle } from '../components/Border'
import tw from 'twin.macro'

const CategoryTag = ({
  category,
  selectCategory,
  selected,
}: {
  category: string
  selectCategory: Dispatch<SetStateAction<string | null>>
  selected: boolean
}) => {
  return (
    <button
      className="items-center overflow-hidden rounded border-b-4 bg-light-300 py-1.5 px-4 m-2 transition-all duration-150 hover:shadow-lg hover:opacity-80 dark:bg-dark-700"
      style={{
        borderBottomColor: selected ? 'orange' : '#DCDCDC',
      }}
      onClick={() => {
        selectCategory(selected ? null : category)
      }}
    >
      {category}
    </button>
  )
}

const Blog: NextPage<{ posts: PageObjectResponse[] }> = ({ posts }) => {
  const { privateAccessable } = useContext(PrivateContext)
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedCategory, selectCategory] = useState<string | null>(null)
  const openSearchBox = () => setSearchOpen(true)

  !privateAccessable &&
    (posts = posts.filter(
      (post) => !(post.properties?.private as any).checkbox
    ))
  const categories = new Set<string>()
  let metadata = posts.map((post) => {
    const emoji = post.icon?.type === 'emoji' ? post.icon.emoji : '🎑'
    const prop = post.properties as unknown as PageCompletePropertyRecord

    const slug =
      'results' in prop.slug && prop.slug.results[0].type === 'rich_text'
        ? prop.slug.results[0].rich_text.plain_text
        : ''
    const name =
      'results' in prop.name && prop.name.results[0].type === 'title'
        ? prop.name.results[0].title.plain_text
        : ''
    const preview =
      'results' in prop.preview && prop.preview.results[0].type === 'rich_text'
        ? prop.preview.results[0].rich_text.plain_text
        : ''
    const date = prop.date.type === 'date' ? prop.date.date?.start ?? '' : ''

    const author = 'results' in prop.author ? prop.author.results : []
    const category = 'select' in prop.category ? prop.category.select : null
    category?.name && categories.add(category.name)

    return { id: post.id, emoji, slug, name, preview, date, author, category }
  })

  selectedCategory &&
    (metadata = metadata.filter(
      (post) => post.category?.name === selectedCategory
    ))

  return (
    <>
      <Head>
        <title>Kendrick Zou - Blog</title>
      </Head>

      <SearchModal searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

      <div className="mx-auto max-w-4xl container px-6">
        <H1 css={HrStyle}>Blog</H1>

        {/* <div className="mb-8">
          {Array.from(categories.values()).map((category) => (
            <CategoryTag
              key={category}
              category={category}
              selectCategory={selectCategory}
              selected={category == selectedCategory}
            />
          ))}
        </div> */}

        {metadata.map((meta) => (
          <div key={meta.id} className="pb-10 pt-6">
            <div className="grid grid-flow-row-dense grid-cols-2 sm:grid-cols-4">
              <div className="col-span-1 mb-4 text-gray-500/90 dark:text-gray-400/90">
                {DateTime.fromISO(meta.date).setZone('UTC+8').toFormat('yyyy-MM-dd')}
              </div>
              <div className="col-span-3">
                <Heading>
                  <a href={`/blog/${meta.slug}`}>{meta.emoji}{' '}{meta.name}</a>
                </Heading>
                <Link css={tw`pl-1`} href={`/blog/${meta.slug}`}>
                  {meta.category?.name.toUpperCase()}
                </Link>
                <div className="mt-6 text-gray-400/90 dark:text-gray-300/90 pl-1">{meta.preview}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1" />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const db = await getDatabase()
  return {
    props: { posts: db },
    revalidate: 60 * 60, // 10 minutes
  }
}

export default Blog
