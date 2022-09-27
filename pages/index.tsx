import type { GetStaticProps, NextPage } from 'next'
import { FiArrowRight, FiMail } from 'react-icons/fi'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import NowPlaying from '../components/NowPlaying'
import Sakana from '../components/Sakana'
import { type LatestPostProps, getLatestPostProps } from '../lib/notion'

const Home: NextPage<{ latestPost: LatestPostProps }> = ({ latestPost }) => (
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
        Researcher / Developer{' '}
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
          🌲 CYBER#SEU
        </a>{' '}
        on astrology, alchemy. Graduated from{' '}
        <a
          href="https://cose.seu.edu.cn"
          target="_blank"
          rel="noopener noreferrer"
          className="hover-links"
        >
          COSE#SEU
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

      {latestPost && (
        <p className="leading-7">
          Latest post:{' '}
          <Link href={`/blog/${latestPost.slug}`}>
            <a className="group inline-flex flex-wrap items-center">
              <span className="hover-links">
                {latestPost.emoji || '📚'} {latestPost.title}
              </span>
              <FiArrowRight className="h-4 w-4 transition-all duration-150 group-hover:translate-x-1" />
            </a>
          </Link>
        </p>
      )}

      <p className="mt-8 leading-7">
        Contact me:{' '}
        <a
          href="mailto:zoudikai@outlook.com"
          className="group inline-flex flex-wrap items-center"
        >
          <span className="hover-links">
            {/* <FiMail size={15} className="mr-2 inline" /> */}
            📨 zoudikai#outlook.com
          </span>
        </a>
      </p>

      <div className="secondary-text text-center font-mono text-xs">
        <p className="leading-7 mt-8">
          This site is forked from{' '}
          <a
            href="https://github.com/spencerwooo/spencerwoo.com"
            className="bg-indigo-600/10 text-indigo-600 p-1 rounded font-bold transition-all duration-150 hover:bg-indigo-600/20"
          >
            spencerwooo/spencerwoo.com
          </a>
          , built with ❤️ love and 💻 expertise by spencerwoo.
        </p>
      </div>

      {/* <NowPlaying /> */}

      <Sakana />
    </div>
  </>
)

export const getStaticProps: GetStaticProps = async () => {
  const latestPost = await getLatestPostProps()

  return {
    props: { latestPost },
    revalidate: 60 * 10, // 10 minutes
  }
}

export default Home
