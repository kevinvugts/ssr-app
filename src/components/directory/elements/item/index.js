/** @flow */

import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../../elements'

import { IKImage } from 'imagekitio-react'
import { getImageURL } from '../../../../core/helpers/Image'

const defaultProps = {
  id: '',
  images: [],
  title: '',
  slug: '',
  path: '/collections/detail',
  className: 'card card-poster h-100 gradient-overlay hover-animate',
  minHeight: '240px',
  format: 'medium',
  disabledLink: false,
  selected: false,
}

/**
 * Render a imageTile card element.
 * @constructor
 * @param {object} props                    - The properties object.
 * @param {(array|object)} props.images     - An array of images or a single Image object.
 * @param {(array)} props.professionals     - An array with the professionals for this is project. The first one will be displayed.
 * @param {string} props.title              - Title to display
 * @param {string} props.slug               - URL slug.
 * @param {string} [props.path]             - Optional base path for the url.
 * @param {string} [props.className]      - Optional className.
 * @return {html}                           - The html <div.card /> element.
 */
const ImageTitleCard = (instanceProps) => {
  const props = { ...defaultProps, ...instanceProps }

  return (
    <div
      className={`card shadow-lg w-100 hover-animate rounded-0 gradient-overlay ${
        props.selected ? 'border-3 border-primary' : 'border-0 '
      }`}
      style={{ minHeight: props.minHeight }}
      key={`elements-card-${props.id}`}
    >
      {!props.disabledLink && (
        <Link to={`${props.path}/${props.slug}`} className="tile-link"></Link>
      )}

      <IKImage
        className="bg-image"
        path={getImageURL(props.images, props.index, props.format)
          .split('/')
          .pop()}
        srcSet={`
          https://ik.imagekit.io/hque/tr:w-395,h-240/${getImageURL(
            props.images,
            props.index,
            props.format
          )
            .split('/')
            .pop()} 425w,

          https://ik.imagekit.io/hque/tr:w-690,h-240/${getImageURL(
            props.images,
            props.index,
            props.format
          )
            .split('/')
            .pop()} 768w,

          https://ik.imagekit.io/hque/tr:w-305,h-240/${getImageURL(
            props.images,
            props.index,
            props.format
          )
            .split('/')
            .pop()} 1024w,
          https://ik.imagekit.io/hque/tr:w-305,h-240/${getImageURL(
            props.images,
            props.index,
            props.format
          )
            .split('/')
            .pop()} 1440w,
          https://ik.imagekit.io/hque/tr:w-305,h-240/${getImageURL(
            props.images,
            props.index,
            props.format
          )
            .split('/')
            .pop()} 2560w
        `}
      />

      <div className="card-body overlay-content text-truncate text-white text-center align-middle d-table h-100">
        <h2 className="text-shadow align-middle d-table-cell">{props.title}</h2>
      </div>
    </div>
  )
}

export { Card, ImageTitleCard }
