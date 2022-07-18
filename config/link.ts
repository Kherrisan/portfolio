import { IconType } from 'react-icons'
import {
  SiGithub,
  SiMedium,
  SiSinaweibo,
  SiSteam,
  SiTelegram,
  SiTwitter,
} from 'react-icons/si'

export interface LinkProps {
  name: string
  link: string
  icon?: IconType
  apiUrl: string
  color: string
  followerName?: string
}

export const socialLinks: LinkProps[] = [
  {
    name: 'GitHub',
    link: 'https://github.com/Kherrisan',
    icon: SiGithub,
    apiUrl: 'https://api.swo.moe/stats/github/Kherrisan',
    color: '#24292f',
  },
  // {
  //   name: 'RSS',
  //   link: 'https://blog.spencerwoo.com/',
  //   icon: Rss,
  //   apiUrl:
  //     'https://api.swo.moe/stats/feedly/https%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml',
  //   color: '#FFA500',
  //   followerName: 'subscribers',
  // },
  {
    name: 'Telegram',
    link: 'https://t.me/Kherrisan',
    icon: SiTelegram,
    apiUrl: 'https://api.swo.moe/stats/telegram/Kherrisan',
    color: '#2CA5E0',
  },
  {
    name: 'Twitter',
    link: 'https://twitter.com/Kherrisan',
    icon: SiTwitter,
    apiUrl: 'https://api.swo.moe/stats/twitter/Kherrisan',
    color: '#1da1f2',
  },
  {
    name: 'Weibo',
    link: 'https://weibo.com/u/5593419409',
    icon: SiSinaweibo,
    apiUrl: 'https://api.swo.moe/stats/weibo/5593419409',
    color: '#e71f19',
  },
  {
    name: 'Steam Games',
    link: 'https://steamcommunity.com/profiles/76561198365158640',
    icon: SiSteam,
    apiUrl: 'https://api.swo.moe/stats/steamgames/76561198365158640',
    color: '#134375',
    followerName: 'games',
  },
  // {
  //   name: 'Steam Friends',
  //   link: 'https://steamcommunity.com/profiles/76561198365158640',
  //   icon: SiSteam,
  //   apiUrl: 'https://api.swo.moe/stats/steamfriends/76561198365158640',
  //   color: '#134375',
  //   followerName: 'friends',
  // },
  // {
  //   name: 'Medium',
  //   link: 'https://medium.com/spencerweekly',
  //   icon: SiMedium,
  //   apiUrl: 'https://api.swo.moe/stats/medium/SpencerWooo',
  //   color: '#00a669',
  //   followerName: 'readers',
  // },
  // {
  //   name: 'SSPAI',
  //   link: 'https://sspai.com/u/spencerwoo/posts',
  //   apiUrl: 'https://api.swo.moe/stats/sspai/spencerwoo',
  //   color: '#d71a1b',
  //   followerName: 'readers',
  // },
]
