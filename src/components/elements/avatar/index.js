/*eslint no-extend-native: ["error", { "exceptions": ["String"] }]*/
/** @flow */

/**
 * Avatar component
 * @module avatar
 * @example
 *
 *    <Avatar avatar={{url:"https://picsum.photos/600/400"}} name="Foo" subTitle="Bar" />
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { getImageURL } from '../../../core/helpers/Image'
import { IKImage } from 'imagekitio-react'

const defaultProps = {
  avatar: {
    url: '',
  },
  format: 'medium',
  size: 'avatar-md',
  name: 'Avatar',
  slug: '-',
  path: '/members/profile',
  classNameWrapper: 'media d-flex align-items-center p-0',
  classNameCaption: 'media-body text-truncate',
  classNameTitle: 'h4 text-dark p-0 m-0 text-nowrap text-truncate',
  classNameSubTitle: 'text-muted m-0 p-0 text-nowrap text-truncate',
  subTitle: false,
  displayTitle: true,
  displaySubTitle: true,
}

String.prototype.getInitials = function (glue = true, maxLength = 2) {
  let initials = this.replace(/[^a-zA-Z- ]/g, '').match(/\b\w/g)

  if (glue) {
    return initials.join('').substr(0, maxLength)
  }

  return initials.substr(0, maxLength)
}

String.prototype.capitalize = function () {
  return this.toLowerCase().replace(/\b\w/g, function (m) {
    return m.toUpperCase()
  })
}

/**
 * Avatar element.
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
 * @return {html}                             - The html element.
 */
export default (instanceProps) => {
  const props = { ...defaultProps, ...instanceProps }

  const subTitle = () => {
    if (props.subTitle && props.displaySubTitle) {
      return <p className={props.classNameSubTitle}>{props.subTitle}</p>
    }
  }

  return (
    <div className={props.classNameWrapper}>
      {props.avatar && props.avatar.url ? (
        <IKImage
          alt={props.name}
          loading="lazy"
          height={window.devicePixelRatio === 2 ? '96' : '48'}
          width={window.devicePxelRatio === 2 ? '96' : '48'}
          lqip={{ active: true, quality: 20 }}
          className={`mr-3 avatar ${
            props.size ? props.size : 'avatar-md'
          } avatar-border-white p-0`}
          path={getImageURL(props.avatar, props.index, props.format)
            .split('/')
            .pop()}
          srcSet={`
            https://ik.imagekit.io/hque/tr:w-48,h-48/${getImageURL(
              props.avatar,
              props.index,
              props.format
            )
              .split('/')
              .pop()} 1x,
              https://ik.imagekit.io/hque/tr:w-96,h-96/${getImageURL(
                props.avatar,
                props.index,
                props.format
              )
                .split('/')
                .pop()} 2x,
                https://ik.imagekit.io/hque/tr:w-144,h-144/${getImageURL(
                  props.avatar,
                  props.index,
                  props.format
                )
                  .split('/')
                  .pop()} 3x,
          `}
        />
      ) : (
        <div
          className={`mr-3 avatar ${
            props.size ? props.size : 'avatar-md'
          } avatar-border-white avatar-initials p-0`}
        >
          {props.name.getInitials()}
        </div>
      )}
      {!props.displayTitle && !props.displaySubTitle ? null : (
        <div className={props.classNameCaption}>
          {!props.displayTitle ? null : (
            <Link
              className={props.classNameTitle}
              to={`${props.path}/${props.slug}`}
            >
              {props.name}
            </Link>
          )}
          {subTitle()}
        </div>
      )}
    </div>
  )
}
