import React from 'react'
import Head from '../../core/Head'
import ScrollRestoration from '../../core/ScrollRestoration'
import BlockHero from '../../blocks/hero/View'

export default (props) => {
  return (
    <div className={`page`}>
      <Head
        pageTitle="500 - Error"
        seo={[
          { meta_description: '', meta_title: '', __component: 'seo.meta' },
          {
            og_image: '',
            og_title: '',
            og_description: '',
            __component: 'seo.open-graph',
          },
        ]}
        {...props}
      />
      <ScrollRestoration />

      <BlockHero
        title=":'("
        content="### Oeps, dat was een fout."
        image={{
          url: '/assets/img/hero-404.jpg',
        }}
        key="error-hero-500"
        slug="500"
      />
      <section className="">
        <div className="container py-7">
          <div className="row text-center">
            <div className="col-12">
              <a href="/" className="btn btn-primary btn-large">
                Terug naar home
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
