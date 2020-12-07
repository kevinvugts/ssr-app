import React from 'react'
import { Link } from 'react-router-dom'
import { getImageURL } from '../core/helpers/Image'

export default (props) => {
  const { profile } = props

  const subLabel = () => {
    if (props.subLabel) {
      return (
        <p className="text-muted m-0 p-0 text-nowrap text-truncate">
          {props.subLabel}
        </p>
      )
    }
  }

  return (
    <div className="media d-flex align-items-center p-0">
      <img
        src={getImageURL(profile.avatar, 0, 'thumbnail')}
        className={`mr-3 avatar ${
          props.size ? props.size : 'avatar-md'
        } avatar-border-white p-0`}
        alt={profile.name}
      />
      <div className="media-body">
        <Link className="h4 text-dark p-0 m-0" to={`/members/${profile.slug}`}>
          {profile.name}
        </Link>
        {subLabel()}
      </div>
    </div>
  )
}
