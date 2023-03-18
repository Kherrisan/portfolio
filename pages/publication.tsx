import type { GetStaticProps, NextPage } from 'next'
import { FiBookmark } from 'react-icons/fi'

import Head from 'next/head'

import HoverCard from '../components/HoverCard'
import getPublications from '../lib/scholar'
import { H1, Heading } from '../components/Header'
import { HrStyle } from '../components/Border'
import { AmberText, SecondaryText } from '../styles/global'
import tw from 'twin.macro'

const Publication: NextPage<{
  data: {
    title: string
    authors: string
    publication?: string
    year: string
    link: string
    cited_by: { value?: number }
  }[]
}> = ({ data }) => {
  return (
    <>
      <Head>
        <title>KendrickZou - Publication</title>
      </Head>

      <div className="container mx-auto max-w-4xl px-6">
        <H1 css={HrStyle}>Publication</H1>

        {data.map((item, index) => (
          <div key={index} className="grid grid-cols-10 sm:grid-cols-12 pb-10 pt-6">
            <div className="col-span-2 mb-4 text-gray-500/90 dark:text-gray-400/90">
              {item.year}
            </div>
            <div className="col-span-10">
              <div css={SecondaryText}>
                {item.authors.split(', ').map((author, index) => (
                  <span key={index}>
                    {author.toLowerCase() === 'd zou' ? (
                      <span className="opacity-100 font-bold">{author}</span>
                    ) : (
                      <span className="opacity-80">{author}</span>
                    )}

                    {index !== item.authors.split(', ').length - 1 && (
                      <span>, </span>
                    )}
                  </span>
                ))}
              </div>
              <Heading>
                <a href={`/`}>{item.title}</a>
              </Heading>
              <div css={[AmberText, tw`font-semibold`]}>
                {item.publication ?? '-'}
              </div>
            </div>
          </div>
        ))}

        <div className="secondary-text text-center font-mono text-xs mt-8">
          Updates every 24 hrs, sourced from{' '}
          <a
            href="https://scholar.google.com/citations?user=zILf1s4AAAAJ&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="hover-links"
          >
            Google Scholar
          </a> through {' '}
          <a
            href='serpapi.com' target="_blank"
            rel="noopener noreferrer"
            className="hover-links">
            serpapi.com
          </a> API.
        </div>
      </div>

      <div className="flex-1" />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await getPublications()
  return {
    props: { data },
    revalidate: 86400, // 24 hrs
  }
}

export default Publication
