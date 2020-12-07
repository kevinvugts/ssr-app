/** @flow */

import React from 'react'
import Moment from 'react-moment'
import Image from '../../../elements/image'

const defaultProps = {
  avatar: {},
  username: '',
  message: '',
  date: new Date(),
  unread: false,
  className: '',
  me: false,
}

/**
 * Render a chat item element.
 * @constructor
 * @param {object} props                    - The properties object.
 * @return {html}                           - The html <div.card /> element.
 */
export default (instanceProps) => {
  const props = { ...defaultProps, ...instanceProps }

  const renderBody = (className) => (
    <div className={`w-100 card ${className} p-2`}>
      <p>{props.message}</p>
    </div>
  )

  const renderDate = () => (
    <small className="text-nowrap">
      <Moment fromNow locale="nl" date={props.date} />
    </small>
  )

  const renderMe = () => (
    <div
      key={`message-item-${props.id}`}
      className="message message-me d-flex justify-content-end text-right"
    >
      <div className="text-wrap">
        {renderBody('bg-primary text-light')}
        {renderDate()}
      </div>
    </div>
  )

  const renderDefault = () => (
    <div key={`message-item-${props.id}`} className="message d-flex">
      <Image
        images={props.avatar}
        className={`mr-3 avatar avatar-border-white p-0`}
        alt={props.username}
      />
      <div className="text-wrap">
        {renderBody('bg-primary-light')}
        {renderDate()}
      </div>
    </div>
  )

  return props.isMe ? renderMe() : renderDefault()
}
