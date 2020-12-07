/** @flow */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
// import AsyncSelect from 'react-select/async';
import useAxios from 'axios-hooks'
// import { DebounceInput } from 'react-debounce-input';
import { Form, InputGroup } from 'react-bootstrap'

const defaultProps = {
  className: '',
  path: '/collections/detail',
}

/**
 * Render the image component connected to a Strapi image object.
 * @constructor
 * @param {object} props                    - The properties object.
 * @param {(string)} [props.className]      - Optional className.
 * @param {(string)} [props.endpoint]       - The endpoint to search from
 * @return {html}                           - The html element.
 */
export default instanceProps => {
  const props = { ...defaultProps, ...instanceProps }
  const [keyword] = useState('')
  const [, setOptions] = useState([])
  const [{ data, loading }, performSearch] = useAxios(
    { url: '/projects' },
    { manual: true }
  )

  const onSearch = query => {
    performSearch({
      params: {
        _q: query,
        _limit: 5,
      },
    }).then(res => {
      setOptions(res.data)
    })
  }

  return <p>Search</p>
}
