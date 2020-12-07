/** @flow */

/**
 * @name Directory
 * Directory component to hook Strapi endpoints to a React collection.
 * Supports filtering, pagination.
 * @module directory
 */
/* eslint-disable  react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { usePaginatedQuery } from 'react-query'
import { client } from '../../utils/api-client'
import Select from './elements/select'
import Keyword from './elements/keyword'
import Sort from './elements/sort'
import Pagination from './elements/pagination'
import Loading from '../../elements/Loading'

import qs from 'qs'

import defaultWrapper from './elements/wrapper'
import { Card, ImageTitleCard } from './elements/item'

import ScrollAnimation from 'react-animate-on-scroll'
//import 'animate.css/animate.min.css'

const defaultProps = {
  classNameRow: 'row',
  classNameResults: 'results col-md-9 col-sm-12 mt-2',
  classNameSearchform: 'search col-md-3 col-sm-12 mt-n4',
  classNameWrapper: 'section pt-6 pb-3',
  classNamePagination: '',
  displayPagination: true,
  endpoint: 'projects',
  filters: [],
  query: {},
  _limit: 36,
  _sort: process.env.REACT_APP_DB_UPDATEDAT + ':DESC',
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
 * @name Directory
 * Core component to display a directory.
 *
 * @constructor
 * @param {object} props                      - The properties object.
 * @param {object} props.avatar               - A single Image object, containing at least an URL.
 * @param {string} props.name                 - Name to display next to the avatar.
 * @param {string} props.path                 - Root path for the URL.
 * @param {string} props.slug                 - Slug for the URL.
 * @param {(string|boolean)} [props.subLabel] - Optional subtitle.
 * @param {string} [props.format]             - Optionally the image format to use.
 * @param {string} [props.size="avatar-md"]   - Optional size of the avatar (avatar-xs, avatar-sm, avatar-md (default), avatar-lg, avatar-xl)
 * @param {string} [props.classNameWrapper]   - Optional wrapper class.
 * @param {string} [props.classNameTitle]     - Optional title class.
 * @param {string} [props.classNameSubTitle]  - Optional subtitle class.
 * @param {boolean} [props.useCache=true]     - Enable or disable cache
 * @return {html}                             - The html element.
 */

const useIsMountedRef = () => {
  const isMounted = React.useRef(false)
  React.useEffect(() => {
    isMounted.current = true
    return () => (isMounted.current = false)
  }, [])
  return isMounted
}

export default instanceProps => {
  const props = { ...defaultProps, ...instanceProps }
  const isMountedRefApproach = useIsMountedRef()
  const params = useParams()
  const location = useLocation()
  const history = useHistory()
  const [page, setPage] = useState(params.pageNumber || 1)

  const buildQuery = newFilter => {
    let par = qs.parse(location.search, { ignoreQueryPrefix: true })

    params && castEmptyToUndefined(params)
    newFilter && castEmptyToUndefined(newFilter)

    // kinda of hardcoded but works for now
    const filters = ['styles_in', '_q', 'size_', 'budget_in']
    const hasFilter = par
      ? Object.keys(par).some(q => filters.indexOf(q) >= 0)
      : false

    return {
      ...props.query,
      ...par,
      ...newFilter,
      _sort: (props.query && props.query._sort) || props._sort,
      _limit: (props.query && props.query._limit) || props._limit,
      _start:
        props.displayPagination && page && !hasFilter
          ? (page - 1) * ((props.query && props.query._limit) || props._limit)
          : 0,
    }
  }

  const {
    resolvedData,
    isLoading,
    isFetching,
    isError,
    error,
  } = usePaginatedQuery(
    [
      'projectsList',
      params
        ? qs.stringify({
            ...buildQuery(),
            page,
            enpoint: props.endpoint,
            query: props.query,
          })
        : 'emptyQuery',
    ],
    () => client(props.endpoint + '?' + qs.stringify(buildQuery()))
  )

  // Casts Null or '' values to undefined so QS automatically ommits them in the parameters
  function castEmptyToUndefined(item) {
    Object.keys(item).map((key, index) => {
      if (item[key] === null || item[key] === '') {
        item[key] = undefined
      }

      return key
    })
  }

  if (isError) {
    console.log('SOME ERROR', error)
  }

  const onSort = () => {}

  // Handle onchange event
  const onShouldSearch = filter => {
    const p = buildQuery(filter)
    history.push(`${location.pathname}?${qs.stringify(p)}`)
  }

  // move to correct url
  React.useEffect(() => {
    history.push(`${location.pathname}?${qs.stringify(buildQuery())}`)
  }, [page])

  React.useEffect(() => {
    if (isMountedRefApproach.current) {
      buildQuery()

      // polyfill scroll to top on page change
      if (!('scrollBehavior' in document.documentElement.style)) {
        //safari does not support smooth scroll
        ;(async () => {
          const { default: smoothScroll } = await import(
            /* webpackChunkName: 'polyfill-modern' */
            'smoothscroll-polyfill'
          )
          smoothScroll.polyfill()
        })()
      } else {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' })
      }
    }
  }, [params])

  const renderFilters = () => {
    let paramFilters = qs.parse(location.search, { ignoreQueryPrefix: true })

    if (props.filters) {
      return props.filters.map((Filter, key) => {
        return (
          <Filter.type
            key={key}
            {...Filter.props}
            classNameWrapper={Filter.props.classNameWrapper}
            onShouldSearch={onShouldSearch}
            selectedValue={[
              ...(Filter.props.selectedValue ? Filter.props.selectedValue : []),
              ...(Filter.props.name && paramFilters[Filter.props.name]
                ? paramFilters[Filter.props.name]
                : []),
            ]}
          />
        )
      })
    }
  }

  const renderPagination = () => {
    const p = qs.parse(location.search, { ignoreQueryPrefix: true })

    if (props.displayPagination && resolvedData && resolvedData.length) {
      return (
        <Pagination
          {...props}
          params={p}
          pageNumber={params.pageNumber || 1}
          query={{ ...props.query, ...p }}
          setPage={setPage}
        />
      )
    }
  }

  const renderSort = () => {
    return (
      <Sort
        name="_sort"
        options={[
          {
            value: 'createdAt:DESC',
            label: 'Meest recent',
          },
          {
            value: 'updatedAt:DESC',
            label: 'Laatst gewijzigd',
          },
        ]}
        onShouldSort={onSort}
      />
    )
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
    onShouldSearch,
    renderLoading,
    isLoading,
    renderPagination,
    renderFilters,
    renderSort,
    results: () => renderResults(resolvedData),
  })
}

/**
 * @name Select
 * Select component that works with directory
 *
 */
export { Select, Keyword, Card, ImageTitleCard }
