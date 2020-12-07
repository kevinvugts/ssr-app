/** @flow */

import React from 'react'
import { getImageURL } from '../../../core/helpers/Image'

const defaultProps = {
  images: [],
  index: 0,
  format: false,
  className: '',
  alt: '',
}

/**
 * Render the image component connected to a Strapi image object.
 * @constructor
 * @param {object} props                    - The properties object.
 * @param {(array|object)} props.images     - An array of images or a single Image object.
 * @param {number} [props.index]            - Optionally the selected index of the props.images array.
 * @param {(string|boolean)} [props.format] - Optional thumbnail format to display. Fallback is the original image.
 * @param {(string)} [props.className]      - Optional className.
 * @param {(string)} [props.alt]            - Optional alt text.
 * @return {html}                           - The html <img /> tag.
 */
export default (instanceProps) => {
  const props = { ...defaultProps, ...instanceProps }
  return (
    <img
      src={getImageURL(props.images, props.index, props.format)}
      className={props.className}
      alt={props.alt}
    />
  )
}
