import React, { useState } from 'react'
import Loader from 'react-loader-spinner'
import { getImageURL } from '../core/helpers/Image'

import Carousel, { Modal, ModalGateway } from 'react-images'

export default (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen)
  }

  const openModal = (index) => {
    setSelectedIndex(index)
    setModalIsOpen(true)
  }

  const renderLoading = () => {
    return (
      <div className="col-12 py-7 text-center">
        <Loader type="TailSpin" color="black" height={40} width={40} />
      </div>
    )
  }

  if (!props.images || !props.images.length) {
    return renderLoading()
  }

  const images = () => {
    return props.images.reduce((res, item) => {
      res.push({
        src: {
          download: item.url,
          fullscreen: item.url,
          regular: item.url,
          thumbnail: item.formats.thumbnail.url,
        },
        caption: item.caption,
        alt: props.title,
      })
      return res
    }, [])
  }

  const renderImage = (index, icon = false, format = 'large') => {
    const image = props.images[index]
    if (image) {
      return (
        <div
          className="card bg-dark w-100 h-100 m-0 p-0 rounded-0 border-0"
          style={{
            background: `center center url('${getImageURL(image, 0, format)}')`,
            backgroundSize: 'cover',
          }}
        >
          <span
            className="tile-link"
            onClick={(e) => {
              e.preventDefault()
              openModal(index)
            }}
          ></span>
          {icon ? (
            <div
              onClick={() => openModal()}
              className="card-img-overlay-top text-right"
            >
              <span className="card-fav-icon position-relative z-index-40 p-0 m-auto">
                <i className="fa fa-expand text-dark"></i>
              </span>
            </div>
          ) : null}
        </div>
      )
    }
  }

  return (
    <div className="gallery">
      <div className="row d-flex" style={{ height: '500px' }}>
        <div className="col-md-8 h-100 m-0 p-1">{renderImage(0, true)}</div>
        <div className="col-4 h-100 d-none d-md-block">
          <div className="row d-flex h-100">
            <div className="col-12 h-50 m-0 p-1">
              {renderImage(1, false, 'medium')}
            </div>
            <div className="col-6 h-25 m-0 p-1">
              {renderImage(2, false, 'medium')}
            </div>
            <div className="col-6 h-25 m-0 p-1">
              {renderImage(3, false, 'medium')}
            </div>
            <div className="col-6 h-25 m-0 p-1">
              {renderImage(4, false, 'medium')}
            </div>
            <div className="col-6 h-25 m-0 p-1">
              {renderImage(5, false, 'medium')}
            </div>
          </div>
        </div>
      </div>

      <ModalGateway>
        {modalIsOpen ? (
          <Modal onClose={toggleModal}>
            <Carousel views={images()} currentIndex={selectedIndex} />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
  )
}
