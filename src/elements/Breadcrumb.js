import React from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default (props) => {
  return (
    <Breadcrumb className="ml-n3">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
        Home
      </Breadcrumb.Item>
      {props.pages.map((page, index) => (
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: page.slug }}
          key={index}
        >
          {page.title}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )
}
