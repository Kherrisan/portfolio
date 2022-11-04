import '@fontsource/dm-serif-text'
import '@fontsource/ia-writer-mono'
import '@fontsource/inter'
import 'katex/dist/katex.min.css'
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes'
import NextNProgress from 'nextjs-progressbar'

import type { AppProps } from 'next/app'
import Script from 'next/script'

import Layout from '../components/Layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider attribute="class">
        <Layout>
          <NextNProgress
            height={1}
            color="rgb(156, 163, 175, 0.9)"
            options={{ showSpinner: false }}
          />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
      <Analytics />
    </>
  )
}

export default MyApp
