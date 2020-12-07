import React from 'react'
import { useParams } from 'react-router-dom'
import Head from '../core/Head'
//mport Area from '../core/Area'
//import ScrollRestoration from '../core/ScrollRestoration'
import { useQuery, useQueryCache } from 'react-query'
import { client } from '../utils/api-client'

import Loading from '../elements/Loading'

//import TagManager from 'react-gtm-module'

export default props => {
  const queryCache = useQueryCache()

  let { slug } = useParams()

  if (slug === undefined || slug === '') {
    slug = 'home'
  }

  // TagManager.dataLayer({
  //   dataLayer: {
  //     slug: slug,
  //   },
  // })

  // const { data, isLoading, isError } = useQuery(['pages', slug], () =>
  //   client(`pages?slug=${slug}`)
  //     .then(res => console.log('RES', res))
  //     .catch(error => console.log('error', error))
  // )

  const { data, isLoading, isError } = useQuery('users', () =>
    client(`users`)
      .then(res => {
        console.log('RES', res)
      })
      .catch(error => console.log('error', error))
  )

  console.log('DATA', data)

  if (isLoading) {
    console.log('Loading ...')

    return <Loading {...props} />
  }

  if (isError || (data && !data.length) || !slug) {
    console.log('Error ...')
    return <p>issue</p>
  }

  const page = data && data[0]
  const seo = page && page['SEO']

  console.log('Rendering Component')

  return (
    <div className={`page default navbar-transparant ${page && page.slug}`}>
      <Head seo={seo} pageTitle={page ? page.title : 'TESTJE'} />
      {/* <ScrollRestoration /> */}
      {/* <Area blocks={page.content} slug={page.slug} /> */}
      <p>this is a tst page</p>
    </div>
  )
}
