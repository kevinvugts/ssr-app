import React from 'react'
import { Dropdown } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
import Truncate from 'react-truncate'
import useAxios from 'axios-hooks'
import NumberFormat from 'react-number-format'
import SubscribeModal from './modals/Subscribe'

export default (props) => {
  const [{ data, loading }] = useAxios('tags?image._id=' + props.image._id)

  const getImageURL = (images = [], index = 0, format = false) => {
    let img
    if (Array.isArray(images) && images.length > 0) {
      img = images[index]
    } else if (images !== null) {
      img = images
    }

    if (img) {
      if (format === false) {
        return img.url
      } else {
        return img.formats[format].url
      }
    }

    return 'https://picsum.photos/600/400'
  }

  const renderCard = (item) => (
    <div className="card h-100 border-0 shadow">
      <div
        className="card-img-top overflow-hidden gradient-overlay bg-cover"
        style={{
          backgroundImage: `url('${getImageURL(item.images, 0, 'small')}')`,
          minHeight: '200px',
        }}
      >
        <a
          href={item.url}
          className="tile-link"
          target="_blank"
          rel="noreferrer noopener"
        >
          link
        </a>
        <div className="card-img-overlay-top text-right">
          <a className="card-fav-icon position-relative z-index-40">
            <i className="fa fa-heart text-white"></i>
          </a>
        </div>
      </div>
      <div className="card-body d-flex align-items-center">
        <div className="w-100">
          <h6 className="card-title">
            <Truncate lines={1}>{item.title}</Truncate>
          </h6>
          <div className="card-subtitle mb-3">
            <p className="text-sm text-muted mb-3t">
              <Truncate lines={2}>
                <ReactMarkdown source={item.description} />
              </Truncate>
            </p>
          </div>
          <div className="card-text d-flex">
            <span className="h4 text-primary mr-auto">
              <NumberFormat
                value={item.price}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'€'}
              />
            </span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-link stretched-link flex-end"
            >
              Bekijken
            </a>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return <div />
  }

  const renderTags = () => {
    if (data && data.length && data[0].tags) {
      return (
        <div className="card-img-overlay p-0 d-flex align-items-center">
          <div className="w-100 overlay-content h-100">
            {data[0].tags.map((tag, i) => (
              <Dropdown
                key={i}
                className="tag"
                style={{
                  left: tag.x + '%',
                  top: tag.y + '%',
                }}
              >
                <Dropdown.Toggle
                  as="a"
                  className="avatar avatar-border-white bg-primary mr-2 hover-animate"
                >
                  <i className="fa fa-tag text-white"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="p-0">
                  {renderCard(tag.product)}
                </Dropdown.Menu>
              </Dropdown>
            ))}
          </div>
        </div>
      )
    }
  }

  return (
    <div className={props.className}>
      <div className="tagged card gradient-overlay">
        <img className="card-img" src={props.image.url} alt={props.image.alt} />
        <div className="card-img-overlay-top text-right">
          <SubscribeModal>
            <a
              className="card-fav-icon position-relative z-index-40 p-0 m0"
              href="#"
            >
              <i className="fa fa-heart text-white"></i>
            </a>
          </SubscribeModal>
        </div>
        {renderTags()}
      </div>
    </div>
  )
}
