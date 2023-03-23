import React, { HTMLAttributes, ReactNode } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import tw, { styled } from 'twin.macro'
import { AmberText } from '../styles/global'
import Link from 'next/link'

export const KLink = ({ children, underline, href, ...props }: { children: ReactNode | ReactNode[], underline?: Boolean, href: string } & Record<string, any>) => (
    <Link href={href} {...props} css={[
        tw`transition-all duration-150 font-semibold`,
        AmberText,
        underline && tw`no-underline border-b-2 border-b-amber-500 hover:border-b-amber-600 dark:border-b-amber-500/90 dark:hover:border-b-amber-400/90 `
    ].concat(props.css)}>
        {children}
    </Link>
)

export const UnderlineLink = tw.span`
    no-underline 
    transition-all 
    duration-150 
    border-b 
    border-b-amber-500 
    hover:border-b-amber-600 
    dark:border-b-amber-500/90 
    dark:hover:border-b-amber-400/90 
    text-amber-500 
    hover:text-amber-600 
    dark:text-amber-500/90 
    dark:hover:text-amber-400/90
`

export const LinkArrowRight = tw(FiArrowRight)`
    h-4 
    w-4 
    transition-all 
    duration-150 
    group-hover:translate-x-1
`

export const Callout = ({children, emoji, ...props}: { children: React.ReactNode | ReactNode[], emoji?: string} & Record<string, any>) => {
    console.log(props)
    return (
        <div {...props} css={[
            tw`p-4 flex rounded-md bg-orange-100 dark:bg-stone-700`
        ].concat(props.css)}>
            <span className='pr-4'>{emoji || '🌟'}</span>
            <div>{children}</div>
        </div>
    )
}
