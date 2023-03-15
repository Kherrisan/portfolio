import React from 'react'
import tw from 'twin.macro'

export const H1 = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => (
    <h1 className='my-8 
    font-extrabold 
    md:text-5xl 
    sm:text-4xl 
    text-3xl 
    text-dark-900/90 
    dark:text-light-900/90'>
        {children}
    </h1>
)

export const H2 = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => (
    <h2 className='my-8 
    font-bold 
    md:text-4xl 
    sm:text-3xl 
    text-2xl 
    text-dark-900/90 
    dark:text-light-900/90'>
        {children}
    </h2>
)

export const Heading = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => (
    <div className='
    font-semibold
    text-2xl
    text-dark-900/90 
    dark:text-light-900/90'>
        {children}
    </div>
)

export const Hr = () => (
    <hr className='my-5 
    h-px 
    bg-gray-300
    dark:bg-gray-300/50
    border-0' />
)