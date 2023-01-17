import '@fontsource/dm-serif-text'
import '@fontsource/ia-writer-mono'
import '@fontsource/inter'
import 'katex/dist/katex.min.css'
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
    { process.env.SERVICE_WORKER && <Script id="sw" strategy='beforeInteractive' dangerouslySetInnerHTML={{
        __html: `    if ("serviceWorker" in navigator) {
            SW_STATUS_KEY="kendrickzou-portfolio-sw-status"
            if (Number(window.localStorage.getItem(SW_STATUS_KEY)) < 1) {
              window.localStorage.setItem(SW_STATUS_KEY, "1")
              window.stop()
              document.write('Wait')
            }
            navigator.serviceWorker.register("/sw.js?time="+Date.now())
                .then(async reg => {
                  if (Number(window.localStorage.getItem(SW_STATUS_KEY)) < 2) {
                    setTimeout(() => {
                      window.localStorage.setItem(SW_STATUS_KEY, "2")
                      window.location.reload() //刷新,以载入sw
                    }, 500); //安装后等待500ms使其激活
                  }
                })
                .catch(err => console.error("error in registering sw.js"))
          }`}} />}
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
      {/* <Analytics /> */}
    </>
  )
}

export default MyApp
