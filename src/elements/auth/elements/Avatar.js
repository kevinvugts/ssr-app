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
import Image from '../../../components/elements/image'

import { useQuery } from 'react-query'
import { client } from '../../../utils/api-client'
import * as auth from '../../../auth-provider'
import Loading from '../../Loading'

const defaultProps = {
  avatar: {
    url: '',
  },
  format: 'medium',
  size: 'avatar-md',
  name: 'Avatar',
  classNameWrapper: 'media d-flex align-items-center p-0',
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
 * Profile Avatar element which will refetch data when queries are being invalidated
 * @constructor
 * @param {object} props                      - The properties object.
 * @param {object} props.avatar               - A single Image object, containing at least an URL.
 * @param {string} props.name                 - Name to display next to the avatar.
 * @param {string} [props.format]             - Optionally the image format to use.
 * @param {string} [props.size="avatar-md"]   - Optional size of the avatar (avatar-xs, avatar-sm, avatar-md (default), avatar-lg, avatar-xl)
 * @param {string} [props.classNameWrapper]   - Optional wrapper class.
 * @return {html}                             - The html element.
 */
export default (instanceProps) => {
  const props = { ...defaultProps, ...instanceProps }

  const { data: me, isLoading, isError, error } = useQuery('me', async () =>
    client('users/me', { token: await auth.getToken() })
  )

  function renderAvatar() {
    return (
      <Image
        images={me.avatar}
        format={props.format}
        className={`mr-3 avatar ${
          props.size ? props.size : 'avatar-md'
        } avatar-border-white p-0`}
        alt={me.name}
      />
    )
  }

  function renderInitials() {
    return (
      <div
        className={`mr-3 avatar ${
          props.size ? props.size : 'avatar-md'
        } avatar-border-white avatar-initials p-0`}
      >
        {props.name.getInitials()}
      </div>
    )
  }

  if (isError) {
    console.log('ERROR >>', error)
    // handling errors
  }

  return me && !isLoading ? (
    <div className={props.classNameWrapper}>
      {me.avatar && me.avatar.url ? renderAvatar() : renderInitials()}
    </div>
  ) : (
    <Loading tiny />
  )
}
