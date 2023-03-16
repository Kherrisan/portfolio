import type { GetStaticProps, NextPage } from 'next'
import { FiArrowRight } from 'react-icons/fi'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import tw from 'twin.macro'

import Sakana from '../components/Sakana'
import { type LatestPostProps, getLatestPostProps } from '../lib/notion'
import { useContext } from 'react'
import { PrivateContext } from '../components/PrivateToggle'
import { H1 } from '../components/Header'
import { Callout, LinkArrowRight, UnderlineLink } from '../components/Link'

import doudou from '../public/images/doudou_spring_320x320.jpg'
import dst_zy from '../public/images/dst_zy.jpg'

const Home = ({ latestPost, latestPrivatePost }: { latestPost: LatestPostProps, latestPrivatePost: LatestPostProps }) => {
  const { privateAccessable } = useContext(PrivateContext);
  latestPost = privateAccessable ? latestPrivatePost : latestPost;

  return (<>
    <Head>
      <title>KendrickZou</title>
    </Head>

    <div className="mx-auto max-w-3xl px-6">
      <Image
        className="rounded-full"
        src={doudou}
        alt="avatar"
        width={120}
        height={120}
        priority
      />

      <H1>Dikai Zou</H1>

      <div className='primary-text'>
        <p className="mb-8 leading-7">
          Researcher / Developer{' '}
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
          on 🧪astrology, 🔭alchemy (=ﾟωﾟ)ﾉ. Graduated from{' '}
          <Link href="https://cose.seu.edu.cn" target='_blank'>
            <UnderlineLink>COSE#SEU</UnderlineLink>{' '}
          </Link>
          (BSc).
        </p>

        <p className="mt-8 leading-7">
          More about me (projects, links):{' '}
          <Link className="group inline-flex flex-wrap items-center" href="/projectsnsocials">
            <UnderlineLink>📚 Projects & Socials</UnderlineLink>
            <LinkArrowRight />
          </Link>
        </p>

        {latestPost && (
          <p className="leading-7">
            Latest post:{' '}
            <Link className="group inline-flex flex-wrap items-center" href={`/blog/${latestPost.slug}`}>
              <UnderlineLink>{latestPost.emoji || '📚'} {latestPost.title}</UnderlineLink>
              <LinkArrowRight />
            </Link>
          </p>
        )}

        <p className="mt-8 leading-7">
          Contact me:{' '}
          <a
            href="mailto:zoudikai@outlook.com"
            className="group inline-flex flex-wrap items-center"
          >
            <UnderlineLink>📨 zoudikai#outlook.com</UnderlineLink>
          </a>
        </p>
      </div>

      <div className='mt-8'>
        <Callout emoji='🥦'>
          今天是3.8妇女节，祝我的宗宗宝贝节日快乐~
          <Image
            className="rounded mt-2"
            src={dst_zy}
            alt="avatar"
            width={120}
            height={120}
            priority
          />
        </Callout>
      </div>      

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

      

      {/* <Sakana /> */}
    </div>
  </>)
}

export const getStaticProps: GetStaticProps = async () => {
  const latestPost = await getLatestPostProps()
  const latestPrivatePost = await getLatestPostProps(true)

  return {
    props: { latestPost, latestPrivatePost },
    revalidate: 60 * 10, // 10 minutes
  }
}

export default Home
