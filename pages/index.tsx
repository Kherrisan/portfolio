import type { GetStaticProps, NextPage } from 'next'
import { FiArrowRight, FiMail } from 'react-icons/fi'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import NowPlaying from '../components/NowPlaying'
import { getLatestPost } from '../lib/notion'

const Home: NextPage<{
  latestPost: any
}> = ({ latestPost }) => (
  <>
    <Head>
      <title>Dikai Zou</title>
    </Head>

    <div className="mx-auto max-w-3xl px-6">
      <Image
        className="rounded-full"
        src="/images/avatar.jpeg"
        alt="avatar"
        width={120}
        height={120}
        priority
      />

      <h1 className="heading-text my-8 font-serif text-4xl">Dikai Zou</h1>

      <p className="mb-8 leading-7">
        Researcher / Developer {' '}
        {/* <a
          href="https://genshin-impact.fandom.com/wiki/Hu_Tao"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-pink-600/10 text-pink-600 p-1 rounded font-bold transition-all duration-150 hover:bg-pink-600/20"
        >
          <abbr title="🔥 C6 by the way" className="!no-underline">
            #HuTao
          </abbr>
        </a>{' '}
        main */}
      </p>

      <p className="leading-7">
        Graduate student at{' '}
        <a
          href="https://cyber.seu.edu.cn"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600/10 text-emerald-600 p-1 rounded font-bold transition-all duration-150 hover:bg-emerald-600/20"
        >
          🌲CYBER#SEU
        </a>{' '}
        on astrology, alchemy. Graduated from{' '}
        <a
          href="https://cse.seu.edu.cn"
          target="_blank"
          rel="noopener noreferrer"
          className="hover-links"
        >
          CSE#SEU
        </a>{' '}
        (BSc).
      </p>

      <p className="mt-8 leading-7">
        More about me (projects, links):{' '}
        <Link href="/projectsnsocials">
          <a className="group inline-flex flex-wrap items-center">
            <span className="hover-links">📚 Projects & Socials</span>
            <FiArrowRight className="h-4 w-4 transition-all duration-150 group-hover:translate-x-1" />
          </a>
        </Link>
      </p>

      <p className="leading-7">
        Latest post:{' '}
        <Link
          href={`/blog/${latestPost.properties.slug.rich_text[0].text.content}`}
        >
          <a className="group inline-flex flex-wrap items-center">
            <span className="hover-links">
              {latestPost.icon?.emoji || '📚'}{' '}
              {latestPost.properties.name.title[0].text.content}
            </span>
            <FiArrowRight className="h-4 w-4 transition-all duration-150 group-hover:translate-x-1" />
          </a>
        </Link>
      </p>

      <p className="mt-8 leading-7">
        Contact me:{' '}
        
        <a href="mailto:zoudikai@outlook.com" className="group inline-flex flex-wrap items-center">
            <span className="hover-links">
              {/* <FiMail size={15} className="mr-2 inline" /> */}
              📨 zoudikai#outlook.com
            </span>
          
        </a>
      </p>

      <p className="leading-7 mb-8">
        
      </p>

      {/* <NowPlaying /> */}
    </div>
  </>
)

export const getStaticProps: GetStaticProps = async () => {
  const latestPost = await getLatestPost()

  return {
    props: { latestPost },
    revalidate: 60 * 10, // 10 minutes
  }
}

export default Home
