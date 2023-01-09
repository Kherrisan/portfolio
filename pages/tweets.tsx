import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import { getTweets } from '../lib/notion'

export interface Tweet {
  id: string,
  content: string,
  datetime: string
}

const TweetCard = (tweet: Tweet) => {
  return (
    <div
      className="flex items-center justify-between overflow-hidden rounded border-b-4 bg-light-300 p-4 transition-all duration-150 hover:shadow-lg hover:opacity-80 dark:bg-dark-700"
      style={{
        borderBottomColor: '',
      }}
    >
      <div>
        <div className="secondary-text text-sm mb-2">{tweet.datetime}</div>
        <div className="font-serif">{tweet.content}</div>
      </div>
    </div>
  )
}

const Tweets: NextPage<{ tweets: Array<Tweet> }> = ({ tweets }) => {
  return (
    <>
      <Head>
        <title>KendrickZou - Tweets</title>
      </Head>

      <div className="container mx-auto max-w-3xl px-6">
        <h1 className="heading-text my-8 font-extrabold text-5xl">
          Tweets
        </h1>

        <div className="mb-8 gap-4">
          {tweets.map((tweet: Tweet) => (
            <TweetCard key={tweet.id} {...tweet}/>
          ))}
        </div>
      </div>

      <div className="flex-1" />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const db = await getTweets()
  return {
    props: { tweets: db },
    revalidate: 10, // 10 seconds
  }
}

export default Tweets
