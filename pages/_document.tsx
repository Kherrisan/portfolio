import React from 'react'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default function MyDocument() {
  return (
    <Html>
      <Head>
        {/* <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://gtm-proxy.kherrisan.workers.dev/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-WTPKPDL');`}}>
        </Script> */}
      </Head>
      <body>
        <Main />
        {/* <Script
          src="https://gtm-proxy.kherrisan.workers.dev/ns.html?id=GTM-WTPKPDL"
          strategy="afterInteractive"
        /> */}
        <NextScript />
      </body>
    </Html>
  )
}

MyDocument.getInitialProps = async (ctx: DocumentContext): Promise<any> => {
  const sheet = new ServerStyleSheet()
  const originalRenderPage = ctx.renderPage
  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
      })
    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
      styles: [
        <React.Fragment key="styles">
          {initialProps.styles}
          {sheet.getStyleElement()}
        </React.Fragment>,
      ],
    }
  } finally {
    sheet.seal()
  }
}