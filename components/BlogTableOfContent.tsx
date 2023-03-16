import { RiBookmark2Line } from 'react-icons/ri'
import { slugify } from 'transliteration'
import Link from 'next/link'
import { AmberTextStyle, Link as KLink } from './Link'
import { PageCompletePropertyRecord } from '../lib/notion'
import { Hr } from './Header'
import { DateTime } from 'luxon'
import tw from 'twin.macro'

type headingType = {
  id: string
  type: 'heading_2' | 'heading_3'
  text: string
  children: headingType[]
}

const BlogTableOfContent = ({ blocks, prop }: { blocks: any, prop: PageCompletePropertyRecord }) => {

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

  // if (headings.length === 0) {
  //   return (
  //     <div className="sticky top-20 col-span-3 hidden h-0 xl:block">
  //       <div className="max-h-screen-md rounded p-4">
  //         <h1 className="primary-text font-bold leading-8">
  //           Table of contents
  //         </h1>
  //         <p className="secondary-text leading-6">
  //           There is no table of contents. Here is a cookie. 🍪
  //         </p>
  //       </div>
  //     </div>
  //   )
  // }

  const nestedHeadings: headingType[] = []
  headings.forEach((h: headingType) => {
    if (h.type === 'heading_2') {
      nestedHeadings.push(h)
    } else if (h.type === 'heading_3' && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].children.push(h)
    }
  })

  return (
    <div className="sticky top-0 col-span-3 hidden h-0 lg:block">
      <div className="max-h-screen-md rounded p-4 pt-16">
        <div>
          <p className='secondary-text text-sm'>Author</p>
          <KLink underline={true} href={'/'}>{author}</KLink>
        </div>
        <Hr />
        <div>
          <p className='secondary-text text-sm'>Published Date</p>
          <span css={[AmberTextStyle, tw`font-semibold`]}>{DateTime.fromISO(date).setZone('UTC+8').toFormat('yyyy-MM-dd')}</span>
        </div>
        <Hr />
        <div>
          <p className='secondary-text text-sm'>Category</p>
          <span css={[AmberTextStyle, tw`font-semibold`]}>{category?.name ?? '_'}</span>
        </div>
        <Hr />
        <div>
          <p className='secondary-text text-sm'>Tag</p>
          {'TAGS'}
        </div>
        <Hr />

        { headings.length === 0 ? (
        <div className="sticky top-20 col-span-3 hidden h-0 xl:block">
          <div className="max-h-screen-md rounded p-4">
            <h1 className="primary-text font-bold leading-8">
              Table of contents
            </h1>
            <p className="secondary-text leading-6">
              There is no table of contents. Here is a cookie. 🍪
            </p>
          </div>
        </div>
        ) : (
        <div>
          <div className='flex'>
            <h1 className="primary-text text-lg">
              <span>Table of contents </span>
            </h1>
          </div>
          <ul className="list-inside list-disc">
            {nestedHeadings.map((h: headingType) => (
              <li className="leading-7" key={h.id}>
                <Link href={`#${slugify(h.text)}`} passHref>
                  {h.text}
                </Link>
                {h.children.length > 0 && (
                  <ul className="ml-6 list-inside list-disc">
                    {h.children.map(
                      (hc: {
                        id: string
                        type: 'heading_2' | 'heading_3'
                        text: string
                      }) => (
                        <li className="leading-7" key={hc.id}>
                          <Link href={`#${slugify(hc.text)}`} passHref>
                            {hc.text}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        )}
      </div>        
    </div>
  )
}

export default BlogTableOfContent
