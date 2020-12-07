import React from 'react'
import useAxios from 'axios-hooks'
import Select from 'react-select'

const defaultProps = {
  className: 'form-group w-100 mb-md-4 mb-2',
}

export default (instanceProps) => {
  const props = { ...defaultProps, ...instanceProps }

  if (!props.name) {
    throw new Error('Name is required.')
  }
  if (!props.endpoint) {
    throw new Error('Endpoint is required.')
  }

  const [{ data, loading }] = useAxios(props.endpoint)

  const generateOptions = (data = []) => {
    if (props.isGrouped) {
      const reduced = data.reduce((prev, curr) => {
        return [
          ...prev,
          {
            label: curr.title,
            slug: curr.slug,
            options: curr.subs
              .sort((a, b) => (a.title > b.title ? 1 : -1))
              .reduce(
                (prev, { id: value, title: label, slug }) => [
                  ...prev,
                  { value, label, slug },
                ],
                []
              ),
          },
        ]
      }, [])

      return reduced
    } else {
      return data.map(({ id: value, title: label, slug }) =>
        Object.assign({}, { value, label, slug: slug || null })
      )
    }
  }

  const onChange = (obj, event) => {
    props.onShouldSearch({
      [props.name]:
        event.action === 'clear' || !obj
          ? undefined
          : obj.reduce((res, item) => {
              res.push(item.value)
              return res
            }, []),
    })
  }

  function getSelectedValues() {
    // single source of truth (everything is handled via props and not parsed in state to prevent inconsistencies in the data)
    let value = props.selectedValue

    if (data) {
      if (props.isGrouped) {
        return generateOptions(data).reduce(
          (prev, cur) => [
            ...prev,
            ...cur.options.filter((option) => value.indexOf(option.value) >= 0),
          ],
          []
        )
      } else {
        return generateOptions(data).filter((obj) => value.includes(obj.value))
      }
    } else {
      return value
    }
  }

  return (
    <div className={props.className}>
      <label className="form-label" htmlFor="form_dates">
        {props.placeholder}
      </label>
      <Select
        isClearable
        isMulti
        onChange={onChange}
        isLoading={loading}
        options={generateOptions(data)}
        value={getSelectedValues()}
        {...props}
        className=""
      />
    </div>
  )
}
