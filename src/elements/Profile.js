import React from 'react'
import { Link } from 'react-router-dom'

import Truncate from 'react-truncate'

import FormModal from '../components/chat/elements/form'

export default (props) => {
  const { profile } = props

  const linkText = 'Neem contact op'

  return (
    <div>
      <p className="text-muted my-4">
        <Truncate lines={5}>{profile.description}</Truncate>
      </p>
      {props.displayAddress && profile.address ? (
        <p className="text-primary">
          <i className="fa-map-marker-alt fa mr-1"></i>{' '}
          <a
            className="text-primary"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://maps.google.com?q=${profile.address.street}+${profile.address.postalCode}+${profile.address.city}`}
          >{`${profile.address.street}, ${profile.address.postalCode} ${profile.address.city}`}</a>
        </p>
      ) : null}
      {props.displayEmail && profile.email ? (
        <p className="text-primary">
          <i className="fa-paper-plane fa mr-1"></i>{' '}
          <a className="text-primary" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </p>
      ) : null}
      {props.displayEmail && profile.url ? (
        <p className="text-primary">
          <i className="fa-globe fa mr-1"></i> {profile.url}
        </p>
      ) : null}
      {props.displayLink ? (
        <>
          <FormModal professional={profile} />
          <Link
            to={`/members/${profile.slug}/contact`}
            className="btn btn-secondary"
          >
            {linkText}
          </Link>
        </>
      ) : null}
    </div>
  )
}
