import React from 'react'
import { client } from '../../../../utils'
import { useMutation, useQuery, useQueryCache } from 'react-query'
import * as auth from '../../../../auth-provider'

const defaultProps = {
  endpoint: 'projects/',
  endpointSuffix: '/wishlist',
  render: (props) => (
    <div className="card-img-overlay-top text-right">
      <a
        className={`position-relative z-index-40 btn btn-outline-light btn-large rounded-circle wishlist-icon px-0 ${
          props.isActive() ? 'active' : ''
        }`}
        style={{ width: '40px', height: '40px' }}
        href="#"
        onClick={props.handleClick}
      >
        <i
          className="fa fa-heart"
          style={{ width: '40px', height: '40px' }}
        ></i>
      </a>
    </div>
  ),
}

export default (instanceProps) => {
  const props = { ...defaultProps, ...instanceProps }
  const queryCache = useQueryCache()
  const { data: me } = useQuery(
    'me',
    async () =>
      await client('users/me', {
        token: await auth.getToken(),
      }).catch((error) => console.log('ERROR', error)),
    { retry: 2 }
  )

  const isActive = () =>
    me ? me.wishlist.filter((obj, i) => obj === props.id).length > 0 : false

  const [mutate] = useMutation(
    async (values) =>
      client(props.endpoint + props.id + props.endpointSuffix, {
        data: {},
        method: 'POST',
        token: await auth.getToken(),
      }),
    {
      onMutate: (newState) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        queryCache.cancelQueries('me')

        const previousMe = queryCache.getQueryData('me')

        const updatedWishlist = () =>
          previousMe.wishlist.includes(props.id)
            ? (previousMe.wishlist = previousMe.wishlist.filter(
                (o) => o !== props.id
              ))
            : [...previousMe.wishlist, props.id]

        // Optimistically update to new wishlist state
        queryCache.setQueryData('me', (oldMe) =>
          Object.assign({}, { ...oldMe, wishlist: updatedWishlist() })
        )

        // Return the snapshotted value and rollback function
        return () => queryCache.setQueryData('me', previousMe)
      },
      onError: (err, variables, recover) =>
        typeof recover === 'function' ? recover() : null,
      onSettled: () => queryCache.invalidateQueries('me'),
    }
  )

  return props.render({
    isActive,
    handleClick: (e) => {
      props.handleClick()
      e.preventDefault()
      me && mutate()
    },
  })
}
