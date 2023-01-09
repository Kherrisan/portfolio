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
import { useEffect, useState } from 'react';

const SW_STATUS_KEY = 'kendrickzou-portfolio-sw-status'

function MyApp({ Component, pageProps }: AppProps) {
  const [privateAccessable, setPrivate] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      /*
    ChenBlogHelper_Set 存储在LocalStorage中,用于指示sw安装状态
    0 或不存在 未安装
    1 已打断
    2 已安装
    3 已激活,并且已缓存必要的文件(此处未写出,无需理会)
    */
      if (Number(window.localStorage.getItem(SW_STATUS_KEY)) < 1) {
        window.localStorage.setItem(SW_STATUS_KEY, "1")
        window.stop()
        document.write('Wait')
      }
      window.addEventListener("load", function () {
        navigator.serviceWorker.register(`/sw.js?time=${Date.now()}`)
          .then(async reg => {
            if (Number(window.localStorage.getItem(SW_STATUS_KEY)) < 2) {
              setTimeout(() => {
                window.localStorage.setItem(SW_STATUS_KEY, "2")
                //window.location.search = `?time=${ranN(1, 88888888888888888888)}` //已弃用,在等待500ms安装成功后直接刷新没有问题
                window.location.reload() //刷新,以载入sw
              }, 500); //安装后等待500ms使其激活
            }
          })
          .catch(err => console.error(`${SW_STATUS_KEY} error: ${err}`))
      })
    }
  })

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
