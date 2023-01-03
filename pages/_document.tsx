import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head>
        <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://gtm-proxy.kherrisan.workers.dev/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-WTPKPDL');`}}>
        </Script>
      </Head>
      <body>
        <Main />
        <Script
          src="https://gtm-proxy.kherrisan.workers.dev/ns.html?id=GTM-WTPKPDL"
          strategy="afterInteractive"
        />
      </body>
    </Html>
  )
}