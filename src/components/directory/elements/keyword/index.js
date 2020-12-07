import React, { useState } from 'react'
import { DebounceInput } from 'react-debounce-input'

const defaultProps = {
  name: '_q',
  placeholder: 'Zoek op trefwoord',
  className: 'form-group w-100 mb-md-4 mb-2',
  minLength: 2,
  timeout: 300,
}

export default (instanceProps) => {
  const props = { ...defaultProps, ...instanceProps }

  const [value, setValue] = useState('')

  if (!props.name) {
    throw new Error('Name is required.')
  }

  const onChange = (event) => {
    const val = event.target.value
    setValue(val)
    if (val.length >= 3 || val.length === 0) {
      props.onShouldSearch({
        [props.name]: val,
      })
    }
  }

  return (
    <div className={props.className}>
      <label className="form-label" htmlFor="keyword">
        {props.placeholder}
      </label>
      <DebounceInput
        id="keyword"
        className="form-control"
        minLength={props.minLength}
        debounceTimeout={props.timeout}
        onChange={onChange}
        value={value}
      />
    </div>
  )
}
