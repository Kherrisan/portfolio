import { RiBookmark2Line } from 'react-icons/ri'
import { slugify } from 'transliteration'

import Link from 'next/link'

type headingType = {
  id: string
  type: 'heading_2' | 'heading_3'
  text: string
  children: headingType[]
}

const BlogTableOfContent = ({ blocks }: { blocks: any }) => {
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

  if (headings.length === 0) {
    return (
      <div className="sticky top-0 col-span-3 hidden h-0 xl:block">
        <div className="max-h-screen-md rounded border border-gray-400/30 p-4">
          <h1 className="primary-text font-bold leading-8">
            Table of contents
          </h1>
          <p className="secondary-text leading-6">
            There is no table of contents. Here is a cookie. 🍪
          </p>
        </div>
      </div>
    )
  }

  const nestedHeadings: headingType[] = []
  headings.forEach((h: headingType) => {
    if (h.type === 'heading_2') {
      nestedHeadings.push(h)
    } else if (h.type === 'heading_3' && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].children.push(h)
    }
  })

  return (
    <div className="sticky top-20 col-span-3 hidden h-0 lg:block">
      <div className="max-h-screen-md rounded border border-gray-400/30 p-4 relative">
        <RiBookmark2Line
          className="text-red-600 absolute top-4 right-4"
          size={20}
        />
        <h1 className="primary-text text-lg leading-8">
          <span>Table of contents </span>
        </h1>
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
    </div>
  )
}

export default BlogTableOfContent
