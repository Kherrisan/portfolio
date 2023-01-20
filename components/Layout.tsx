import { Inter } from '@next/font/google'
import Head from 'next/head'
import tw from 'twin.macro'

import Footer from './Footer'
import Navbar from './Navbar'

export const Container = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => (
  <div className='container mx-auto max-w-3xl px-6'>
    {children}
  </div>
)

const inter = Inter({
  subsets: ['latin'],
})

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <div className={`${inter.className} font-sans`}>
      <Head>
        <meta name="description" content="Kendrick Zou" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>

      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mt-8 flex-1 flex flex-col justify-center">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  </>
)
export default Layout
