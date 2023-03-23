import type { NextPage } from 'next'

import Head from 'next/head'
import Image from 'next/image'

import friend_comment_9 from '../public/images/friend_comment_9.jpg'

import Comments from '../components/Comments'
import PrivateToggle from '../components/PrivateToggle'
import { FriendProps, friends } from '../config/friend'
import { H1 } from '../components/Header'
import { HrStyle } from '../components/Border'

const FriendCard = (props: FriendProps) => {
  return (
    <a href={props.link} target="_blank" rel="noopener noreferrer">
      <div
        className="flex items-center justify-between overflow-hidden rounded border-b-4 bg-light-300 p-4 transition-all duration-150 hover:shadow-lg hover:opacity-80 dark:bg-dark-700"
        style={{
          borderBottomColor: props.bgColor,
        }}
      >
        <div>
          <div className="text-lg">{props.id}</div>
          <div className="secondary-text text-sm">{props.link}</div>
        </div>
        <Image
          src={props.avatar}
          width={32}
          height={32}
          alt={props.link}
          className="rounded-full"
        />
      </div>
    </a>
  )
}

const Friends: NextPage = () => {
  return (
    <>
      <Head>
        <title>KendrickZou - Friends</title>
      </Head>

      <div className="container mx-auto max-w-3xl px-6">
        <H1 css={HrStyle}>
          Friends{' '}
          <PrivateToggle />
        </H1>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {friends.map((friend: FriendProps) => (
            <FriendCard key={friend.id} {...friend} />
          ))}
        </div>

        <p className="secondary-text mt-6 text-center">
          👇 随便留下点什么吧，如果实在想不到，可以参考下图： 👇
        </p>

        <div className="flex mx-auto justify-center max-w-sm mt-6">
          <Image className='mx-auto' src={friend_comment_9} alt="friend_comment_9" />
        </div>

        <Comments />
      </div>

      <div className="flex-1" />
    </>
  )
}

export default Friends
