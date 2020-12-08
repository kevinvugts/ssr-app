import React from 'react'
import { useParams } from 'react-router-dom'
import Head from '../core/Head'
import Area from '../core/Area'
import { useQuery } from 'react-query'
import { client } from '../utils/api-client'

import Loading from '../elements/Loading'

export default props => {
  let { slug } = useParams()

  if (slug === undefined || slug === '') {
    slug = 'home'
  }

  const { data, isLoading, isError } = useQuery(['pages', slug], () =>
    client(`pages?slug=${slug}`)
      .then(res => {
        console.log('RES', res)
        return res
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
      <Area blocks={page.content} slug={page.slug} />
    </div>
  )
}
