import type { GetStaticProps, NextPage } from 'next'
import { FiExternalLink } from 'react-icons/fi'
import { GiChest } from 'react-icons/gi'
import useSWR from 'swr'

import Head from 'next/head'
import Image from 'next/image'

import { LinkProps, socialLinks } from '../config/link'
import { ProjectProps, projectLinks } from '../config/project'
import arknightCard from '../public/images/arknights@2x.jpeg'
import KImage from '../components/KImage'
import { H1 } from '../components/Header'
import { Callout } from '../components/Link'
import { HrStyle } from '../components/Border'
import tw from 'twin.macro'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const LinkFollowerText = ({
  apiUrl,
  followerName,
}: {
  apiUrl: string
  followerName: string
}) => {
  const { data, error } = useSWR(apiUrl, fetcher)

  if (error) return <div className="font-mono text-xs">-</div>
  if (!data) return <div className="font-mono text-xs">...</div>
  return (
    <div className="font-mono text-xs">
      {data.count} {followerName}
    </div>
  )
}

const LinkCard = (props: LinkProps) => {
  const pronoun = props.followerName ? props.followerName : 'subs'

  return (
    <a href={props.link} target="_blank" rel="noopener noreferrer">
      <div
        className="flex items-center justify-between overflow-hidden rounded border-b-4 bg-light-300 p-4 transition-all duration-150 dark:bg-dark-700 hover:opacity-80 hover:shadow-lg"
        style={{ borderBottomColor: props.color }}
      >
        <div>
          <div className="font-bold text-sm">{props.name}</div>
          <LinkFollowerText apiUrl={props.apiUrl} followerName={pronoun} />
        </div>
        {props.icon ? (
          <props.icon size={18} className="opacity-70" />
        ) : (
          <FiExternalLink size={18} className="opacity-70" />
        )}
      </div>
    </a>
  )
}

const ProjectCard = (props: ProjectProps) => {
  return (
    <a href={props.link} target="_blank" rel="noopener noreferrer">
      <div className="primary-text flex items-center justify-between rounded border-b-4 bg-light-300 p-4 space-x-4 transition-all duration-150 hover:opacity-80 hover:shadow-lg dark:bg-dark-700">
        <div className="truncate">
          <div className="font-bold">{props.name}</div>
          <div className="font-mono text-sm">{props.slug}</div>
        </div>
        <props.icon size={24} className="flex-shrink-0" />
      </div>
    </a>
  )
}

const ProjectsNSocials: NextPage<{}> = ({ }) => {

  return (
    <>
      <Head>
        <title>KendrickZou - Projects & Socials</title>
      </Head>

      <div className="container mx-auto max-w-3xl px-6">
        <H1 css={HrStyle}>Arknights</H1>

        <div className="shadow-xl text-0 rounded overflow-hidden mt-6">
          <Image src={arknightCard} alt="Arknights Background" />
        </div>

        <Callout css={tw`mt-6`} emoji='🎮'>
          <div className='primary-text text-center'>
            明日方舟国服开服老玩家，退坑约两年半之后重新回到罗德岛。目前是无情的抄作业机器+屯屯鼠，希望能够组建一支法术蒸发和深海猎人组合队。我永远喜欢斯卡蒂~
          </div>
          <div className='primary-text text-center font-bold mt-6'>
            国服 ID:{' '}KendrickZou
          </div>
        </Callout>

        {/* <div className="secondary-text text-center font-mono text-xs mt-4">
          Updates every 24 hrs. Background images shot by myself in-game.
          
        </div> */}

        <H1 css={HrStyle}>Projects</H1>

        <H1 css={HrStyle}>Socials</H1>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {socialLinks.map((link: LinkProps) => (
            <LinkCard key={link.name} {...link} />
          ))}
        </div>

        <div className="secondary-text text-center font-mono text-xs">
          Real-time stats, powered by{' '}
          <a
            className="hover-links"
            href="https://github.com/spencerwooo/substats"
            target="_blank"
            rel="noopener noreferrer"
          >
            substats
          </a>
          .
        </div>
      </div>

      <div className="flex-1" />
    </>
  )
}

export default ProjectsNSocials
