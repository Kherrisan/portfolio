import React from 'react'
import tw from 'twin.macro'
import { HeadingText } from '../styles/global'

export const H1 = ({ children, ...props }: { children: React.ReactNode | React.ReactNode[] } & Record<string, any>) => (
    <h1 {...props} css={[HeadingText, tw`py-8 font-extrabold md:text-5xl sm:text-4xl text-2xl`].concat(props.css)}>
        {children}
    </h1>
)

export const H2 = ({ children, ...props }: { children: React.ReactNode | React.ReactNode[] } & Record<string, any>) => (
    <h2 {...props} css={[HeadingText, tw`py-8 font-bold md:text-4xl sm:text-3xl text-2xl`].concat(props.css)}>
        {children}
    </h2>
)

export const Heading = ({ children, ...props }: { children: React.ReactNode | React.ReactNode[] } & Record<string, any>) => (
    <div {...props} css={[HeadingText, tw`font-semibold text-2xl`].concat(props.css)}>
        {children}
    </div>
)