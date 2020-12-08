import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import useAxios from 'axios-hooks'
import Image from '../../elements/image'

/**
 * @name Chat
 * Chat channel list
 *
 * @constructor
 * @param {object} props                      - The properties object.
 * @param {string} [props.endpoint]             - Optionally the image format to use.
 * @param {boolean} [props.useCache=true]     - Enable or disable cache
 * @return {html}                             - The html element.
 */
const defaultProps = {
  channel: { id: 1 },
  endpointMe: 'users/me',
  endpoint: 'channels',
  filters: [],
  _limit: 10,
  _sort: APP_CONFIG.updatedAt + ':DESC',
  renderItem: (item, index) => <div />,
  useCache: false,
}

export default instanceProps => {
  const props = { ...defaultProps, ...instanceProps }

  const [{ data: me, loading: meLoading }] = useAxios(
    {
      url: props.endpointMe,
    },
    {
      useCache: true,
    }
  )

  const [{ data, loading }] = useAxios(
    {
      url: props.endpoint,
      params: {
        _sort: props._sort,
        _limit: props._limit,
      },
    },
    {
      useCache: props.useCache,
    }
  )

  if (meLoading || loading) {
    return <div />
  }

  const getTo = channel => {
    return channel.users.filter((element, index, array) => {
      return element.id !== me.id
    })
  }

  const renderChannels = data => {
    if (!data) {
      return
    }
    return (
      <ul className="list-group list-group-flush">
        {data.map(channel => {
          const toUser = getTo(channel)
          const previewMessage = channel.messages[0]
          const isSelected = channel.id == props.channel.id
          console.log(channel)
          return (
            <Link
              key={`channel-list-item-${channel.id}`}
              className={`list-group-item list-group-item-action ${
                isSelected ? 'active' : ''
              }`}
              to={`/berichten/${channel.id}`}
            >
              <div className="d-flex w-100">
                <Image
                  images={toUser[0].avatar}
                  className={`mr-3 avatar avatar-sm avatar-border-white p-0`}
                />
                <div className="media w-100 text-truncate">
                  <div className="d-flex w-100">
                    <div className="mr-1 text-truncate">
                      <p className="mb-0 h6 text-truncate">
                        {toUser[0].username}
                      </p>
                      <small className="mb-1 text-truncate">
                        {channel.messages.length ? previewMessage.body : null}
                      </small>
                    </div>
                    <small className="ml-auto text-nowrap">
                      {channel.messages.length ? (
                        <Moment
                          fromNow
                          locale="nl"
                          date={previewMessage.createdAt}
                        />
                      ) : null}
                    </small>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </ul>
    )
  }

  return renderChannels(data)
}
