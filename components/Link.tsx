import React, { ReactNode } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import tw from 'twin.macro'

export const Link = tw.a`
    transition-all 
    duration-150 
    text-amber-500 
    hover:text-amber-600 
    dark:text-amber-500/90 
    dark:hover:text-amber-400/90
`

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

const BlockCalloutP = tw.p`p-4 flex rounded-md bg-orange-100 dark:bg-stone-700`

export const BlockCallout = (props: { children: React.ReactNode | ReactNode[], emoji?: string }) => (
        <BlockCalloutP>
            <span className='pr-4'>{props.emoji || '🌟'}</span>
            <div>{props.children}</div>
        </BlockCalloutP>
    )
