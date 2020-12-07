/** @flow */

/**
 * @name PreviewDirectory
 * Directory component to hook Strapi endpoints to a React collection.
 * Supports filtering, pagination.
 * @module directory
 */

import React from 'react'
import { useQuery } from 'react-query'
import { client } from '../../utils/api-client'
import Select from './elements/select'
import Keyword from './elements/keyword'

import Loading from '../../elements/Loading'

import qs from 'qs'

import defaultWrapper from './elements/wrapper'
import { Card, ImageTitleCard } from './elements/item'

import ScrollAnimation from 'react-animate-on-scroll'
//import 'animate.css/animate.min.css'

const defaultProps = {
  classNameRow: 'row',
  classNameResults: 'results col-md-9 col-sm-12 mt-2',
  classNameWrapper: 'section pt-6 pb-3',
  endpoint: 'projects',
  filters: [],
  query: {},
  _limit: 3,
  renderWrapper: defaultWrapper,
  renderItem: (item, index) => (
    <div className="col-md-4 col-sm-12 mb-5" key={`${index}-${item.id}`}>
      <ScrollAnimation
        animateIn="animate__animated animate__fadeInUpSmall"
        animateOnce={true}
        delay={(index % 4) * 50}
      >
        <Card {...item} />
      </ScrollAnimation>
    </div>
  ),
  useCache: true,
}

/**
 * @name PreviewDirectory
 * Core component to display a directory.
 *
 * @constructor
 * @param {object} props                      - The properties object.
 * @param {string} props.name                 - Name to display next to the avatar.
 * @param {string} props.path                 - Root path for the URL.
 * @param {string} props.slug                 - Slug for the URL.
 * @return {html}                             - The html element.
 */

export default instanceProps => {
  const props = { ...defaultProps, ...instanceProps }

  const queryKey = qs.stringify({
    ...props.query,
    _sort: (props.query && props.query._sort) || props._sort,
    _limit: (props.query && props.query._limit) || props._limit,
    _start: 0,
  })

  const { data, isLoading, isFetching, isError, error } = useQuery(
    ['projectsList', props.query ? queryKey : 'emptyQuery'],
    () => client(props.endpoint + '?' + queryKey)
  )

  if (isError) {
    console.log('Handle Error', error)
  }

  const renderLoading = () => {
    if (isLoading || isFetching) {
      return (
        <div className="col-12 h-25 text-center">
          <Loading />
        </div>
      )
    }
  }

  const renderResults = data => {
    if (!data || isLoading || isFetching) {
      return <div />
    } else if (!data.length) {
      return (
        <div className="col-12 py-7 text-center">
          <h3 className="h1 mb-4">{":'("}</h3>
          <p className="lead text-muted">
            Helaas hebben we geen resultaten gevonden.
          </p>
        </div>
      )
    }

    return data.map(props.renderItem)
  }

  return props.renderWrapper({
    ...props,
    renderLoading,
    isLoading,
    results: () => renderResults(props.subs || data),
  })
}

/**
 * @name Select
 * Select component that works with directory
 *
 */
export { Select, Keyword, Card, ImageTitleCard }
