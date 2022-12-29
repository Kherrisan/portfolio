import { Menu, Transition } from '@headlessui/react'
import { useTheme } from 'next-themes'
import { Fragment, useContext, useEffect, useState } from 'react'
import { FiHome, FiMenu, FiRss } from 'react-icons/fi'

import Image from 'next/image'
import Link from 'next/link'
import { PrivateContext } from './PrivateToggle'

const navigations = [
  {
    name: 'Blog',
    link: '/blog',
    private: false
  },
  {
    name: 'Publication',
    link: '/publication',
    private: false
  },
  {
    name: 'Projects & Socials',
    link: '/projectsnsocials',
    private: false
  },
  {
    name: 'Friends',
    link: '/friends',
    private: false
  },
  {
    name: 'Tweets',
    link: '/tweets',
    private: true,
  },
  {
    name: 'Travelling',
    link: 'https://travellings.link',
    private: false
  }
]

const MenuItemLink = (props: { href: string; children: React.ReactNode }) => {
  const { href, children, ...rest } = props
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  )
}

const Navbar = () => {
  const { privateAccessable } = useContext(PrivateContext);
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="primary-text z-10 flex items-center px-4 py-3 justify-between sticky top-0 backdrop-blur-lg bg-white/30 dark:bg-dark-900/50">
      <Link href="/">
        <FiHome size={20} />
      </Link>

      <div className="flex items-center space-x-4">
        <nav className="hidden items-center space-x-2 sm:flex">
          {navigations.filter((n) => privateAccessable || !n.private).map((n, i) => (
            <Link href={n.link} key={i} passHref>
              <a className="nav-links">{n.name}</a>
            </Link>
          ))}
        </nav>

        <div className="block sm:hidden">
          <Menu as="div" className="relative text-left">
            <Menu.Button className="flex items-center text-current">
              <FiMenu size={20} />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition duration-150 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded bg-white shadow-lg grid divide-y divide-gray-400/30 dark:bg-dark-700 focus:outline-none">
                {navigations.filter((n) => privateAccessable || !n.private).map((n, i) => (
                  <Menu.Item key={i}>
                    <MenuItemLink href={n.link}>
                      <div className="p-2">{n.name}</div>
                    </MenuItemLink>
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <a
          href="/feed"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-links"
        >
          <FiRss size={20} />
        </a>
      </div>
    </header>
  )
}

export default Navbar
