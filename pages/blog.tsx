import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { GetStaticProps, NextPage } from 'next'
import { AiOutlineTag } from 'react-icons/ai'
import { BiCategory } from 'react-icons/bi'
import { BiSearch } from 'react-icons/bi'

import Head from 'next/head'

import HoverCard from '../components/HoverCard'
import { type PageCompletePropertyRecord, getDatabase } from '../lib/notion'
import SearchModal from '../components/SearchModal'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { PrivateContext } from '../components/PrivateToggle'

const CategoryTag = ({ category, selectCategory, selected }: { category: string, selectCategory: Dispatch<SetStateAction<string | null>>, selected: boolean}) => {

  return (
    <button
      className='items-center overflow-hidden rounded border-b-4 bg-light-300 py-1.5 px-4 m-2 transition-all duration-150 hover:shadow-lg hover:opacity-80 dark:bg-dark-700'
      style={{
        borderBottomColor: selected ? 'orange' : '#DCDCDC'
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
  const { privateAccessable } = useContext(PrivateContext);
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedCategory, selectCategory] = useState<string | null>(null)
  const openSearchBox = () => setSearchOpen(true)

  !privateAccessable && (posts = posts.filter(post => !(post.properties?.private as any).checkbox))
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
  selectedCategory && (metadata = metadata.filter(post => post.category?.name === selectedCategory))

  return (
    <>
      <Head>
        <title>Kendrick Zou - Blog</title>
      </Head>

      <SearchModal searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

      <div className="mx-auto max-w-3xl container px-6">
        <h1 className="heading-text page-heading">Blog</h1>

        {/* <div className='mb-8'>
          {Array.from(categories.values()).map((category) => (
            <CategoryTag key={category} category={category} selectCategory={selectCategory} selected={category==selectedCategory}/>
          ))}
        </div> */}

        {metadata.map((meta) => (
          <HoverCard
            key={meta.id}
            href={`/blog/${meta.slug}`}
            isExternal={false}
            headingSlot={<span className="font-bold text-lg">{meta.name}</span>}
            iconSlot={
              <div className="absolute right-4 -bottom-4 text-2xl">
                {meta.emoji}
              </div>
            }
          >
            <div className="primary-text text-sm truncate">{meta.preview}</div>

            <div className="secondary-text flex flex-wrap items-center space-x-2 text-sm">
              <span>{new Date(meta.date).toLocaleDateString()}</span>
              <span>·</span>
              {/* <BiCategory size={18} className="mr-1 inline" /> */}
              <span className='text-orange-400'>{meta.category?.name?.toLowerCase()}</span>
              {/* <span>·</span>
              {post.properties.tags.multi_select.map((tag: any) => (
                <span>
                  <AiOutlineTag size={16} className="mr-1 inline" />
                  <span key={tag.id}>{tag.name?.toLowerCase()}</span>
                </span>
              ))} */}
            </div>

            <div className="secondary-text flex flex-wrap items-center space-x-2 text-sm"></div>
          </HoverCard>
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
