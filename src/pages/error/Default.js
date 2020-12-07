import React from 'react'
import Head from '../../core/Head'
import ScrollRestoration from '../../core/ScrollRestoration'
import BlockHero from '../../blocks/hero/View'
import hero from '../assets/images/hero-404.jpg'

export default props => {
  return (
    <div className={`page`}>
      <Head
        pageTitle="404 - Pagina niet gevonden"
        seo={[
          { meta_description: '', meta_title: '', __component: 'seo.meta' },
          { og_image: '', og_title: '', __component: 'seo.open-graph' },
        ]}
        {...props}
      />
      <ScrollRestoration />

      <BlockHero
        title=":'("
        content="### Oeps, we hebben niets kunnen vinden."
        image={{
          url: hero,
        }}
        key="error-hero-404"
        slug="404"
        link={{
          url: '/collections',
          title: 'Get inspired',
          class: 'btn btn-primary',
        }}
      />
    </div>
  )
}
