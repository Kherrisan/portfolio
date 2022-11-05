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
import { PrivateContext } from '../components/PrivateToggle'
import '../styles/globals.css'
import { useState } from 'react';


function MyApp({ Component, pageProps }: AppProps) {
  const [privateAccessable, setPrivate] = useState(false);

  return (
    <>
      <PrivateContext.Provider value={{ privateAccessable, setPrivate }}>
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
      </PrivateContext.Provider>
      <Analytics />
    </>
  )
}

export default MyApp
