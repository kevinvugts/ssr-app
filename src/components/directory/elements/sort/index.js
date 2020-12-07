import React from 'react'
import Select from 'react-select'

export default (props) => {
  if (!props.name) {
    throw new Error('Name is required.')
  }

  const onChange = (obj, event) => {
    props.onShouldSort({
      [props.name]: obj.value,
    })
  }

  return <Select className="" onChange={onChange} {...props} />
}
