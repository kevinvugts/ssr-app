/** @flow */

import React, { lazy, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Avatar from '../avatar'
import { useAuth } from '../../../context/auth'
import { getImageURL } from '../../../core/helpers/Image'
import { IKImage } from 'imagekitio-react'
import { Modal, Button } from 'react-bootstrap'
const Wishlist = lazy(() => import('../../directory/elements/wishlist'))

const defaultProps = {
  images: [],
  professionals: [],
  title: '',
  slug: '',
  path: '/collections/detail',
  className: 'card card-poster h-100 gradient-overlay hover-animate',
  minHeight: '60vh',
  handleClick: false,
  format: 'large',
}

/**
 * Render a card element.
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
export default (instanceProps) => {
  const props = { ...defaultProps, ...instanceProps }
  const { me } = useAuth()
  const history = useHistory()
  const [show, setShow] = useState(false)

  return (
    <div
      className="card card-poster h-100 gradient-overlay hover-animate rounded-0"
      style={{ minHeight: props.minHeight }}
      key={`elements-card-${props.id}`}
    >
      <Link to={`${props.path}/${props.slug}`} className="tile-link"></Link>

      <IKImage
        className="bg-image"
        path={getImageURL(props.images, props.index, props.format)
          .split('/')
          .pop()}
        srcSet={`
          https://ik.imagekit.io/hque/tr:w-393,h-871/${getImageURL(
            props.images,
            props.index,
            props.format
          )
            .split('/')
            .pop()} 425w,

          https://ik.imagekit.io/hque/tr:w-353,h-529/${getImageURL(
            props.images,
            props.index,
            props.format
          )
            .split('/')
            .pop()} 768w,

          https://ik.imagekit.io/hque/tr:w-353,h-487/${getImageURL(
            props.images,
            props.index,
            props.format
          )
            .split('/')
            .pop()} 1024w,
          https://ik.imagekit.io/hque/tr:w-313,h-871/${getImageURL(
            props.images,
            props.index,
            props.format
          )
            .split('/')
            .pop()} 1440w,
          https://ik.imagekit.io/hque/tr:w-593,h-871/${getImageURL(
            props.images,
            props.index,
            props.format
          )
            .split('/')
            .pop()} 2560w
        `}
      />

      <div className="card-body overlay-content text-truncate">
        <Avatar
          {...props.professionals[0]}
          format="small"
          subTitle={props.title}
          classNameTitle="h4 text-light p-0 m-0 text-nowrap text-truncate"
          classNameSubTitle="h6 font-weight-light text-mut_ed m-0 p-0 text-nowrap text-truncate"
        />
      </div>
      <Wishlist {...props} handleClick={() => !me && setShow(!show)} />

      {/* Register an account Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Body>
          <button
            className="close"
            type="button"
            onClick={() => setShow(false)}
            aria-label="Close"
          >
            <span aria-hidden="true">&times; </span>
          </button>
          <Modal.Title>Maak een account aan.</Modal.Title>
          <p>Met een account kun je eenvoudig een wensenlijstje aanmaken.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={() => setShow(false)}>
            Nee nog niet
          </Button>
          <Button variant="primary" onClick={() => history.push('/register')}>
            Registreren
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
