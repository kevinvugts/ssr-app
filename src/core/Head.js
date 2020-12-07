import React from 'react'
import { Helmet } from 'react-helmet'

export default ({ pageTitle = '', seo = [] }) => {
  const meta = seo ? seo.find((o) => o.__component === 'seo.meta') || {} : {}
  const openGraph = seo
    ? seo.find((o) => o.__component === 'seo.open-graph') || {}
    : {}

  return (
    <Helmet>
      <title>{pageTitle}</title>

      {/* Meta */}
      <meta charSet="utf-8" />
      <meta name="description" content={meta.meta_description} />
      <meta name="p:domain_verify" content="7bcf566895eb42b739683c7f84e2bd1a" />

      {/* Social */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={openGraph.og_title || ''} />
      <meta
        property="og:description"
        content={openGraph.og_description || ''}
      />
      <meta property="og:image" content={openGraph.og_image || ''} />

      {/* Fonts */}
      <link
        rel="preload"
        as="font"
        href="/assets/fonts/D-DINCondensed.woff2"
        type="font/woff2"
        crossorigin="anonymous"
      />
      <link
        rel="preload"
        as="font"
        href="/assets/fonts/D-DINCondensed-Bold.woff2"
        type="font/woff2"
        crossorigin="anonymous"
      />
      <link
        rel="preload"
        as="font"
        href="/assets/fonts/D-DIN.woff2"
        type="font/woff2"
        crossorigin="anonymous"
      />
      <link
        rel="preload"
        as="font"
        href="/assets/fonts/D-DIN-Bold.woff2"
        type="font/woff2"
        crossorigin="anonymous"
      />

      {/* Styles */}
      <link
        rel="stylesheet"
        href="https://pro.fontawesome.com/releases/v5.15.1/css/all.css"
        integrity="sha384-9ZfPnbegQSumzaE7mks2IYgHoayLtuto3AS6ieArECeaR8nCfliJVuLh/GaQ1gyM"
        crossorigin="anonymous"
      />

      <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
        integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
        crossorigin="anonymous"
      />
    </Helmet>
  )
}
