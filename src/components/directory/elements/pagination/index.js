import React from 'react'
import { useQuery } from 'react-query'
import ReactPaginate from 'react-paginate'
import qs from 'qs'
import { client } from '../../../../utils/api-client'
import { useHistory } from 'react-router-dom'
import { isMobile } from 'react-device-detect'

const toInteger = (v) => (isNaN(v) ? 0 : Math.round(Number(v)))

const calculateTotalPages = (totalItemsInCollection, itemsPerPage) => {
  const e = toInteger(totalItemsInCollection)
  const p = toInteger(itemsPerPage)
  const r = !!(e % p)
  const l = Math.floor(e / p)
  return r ? l + 1 : l
}

const defaultProps = {
  category: 'all',
  hrefBuilder: (pageIndex, props) =>
    `/collections/${props.category ? props.category : 'all'}/${pageIndex}`,
}

export default (instanceProps) => {
  const props = { ...defaultProps, ...instanceProps }
  const history = useHistory()

  const { data: count, loading, error } = useQuery(
    ['countProjects', qs.stringify(props.params)],
    () => client(props.endpoint + '/count?' + qs.stringify(props.query))
  )

  if (loading || error || !props.displayPagination) {
    return <div />
  }

  const handlePageClick = ({ selected }) => {
    // we would like to prevent mutation here
    history.push(
      props.hrefBuilder(selected + 1) + '?' + qs.stringify(props.params)
    )
    props.setPage(selected + 1)
  }

  // hrefbuilder should take current params and append to end of the url
  return (
    <div className="col">
      <nav className="d-flex justify-content-center">
        <ReactPaginate
          pageCount={calculateTotalPages(count, props._limit)}
          initialPage={props.pageNumber - 1}
          pageRangeDisplayed={isMobile ? 1 : 5}
          marginPagesDisplayed={isMobile ? 2 : 3}
          hrefBuilder={(pageIndex) => props.hrefBuilder(pageIndex, props)}
          onPageChange={handlePageClick}
          disableInitialCallback={true}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
          previousLabel={'Vorige'}
          nextLabel={'Volgende'}
        />
      </nav>
    </div>
  )
}
