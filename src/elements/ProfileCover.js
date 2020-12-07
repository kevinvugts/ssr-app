import React, { useEffect } from 'react'
import Swiper from 'swiper'
import Truncate from 'react-truncate'
import Avatar from '../components/elements/avatar'
import FormModal from '../components/chat/elements/form'

export default (props) => {
  const { profile } = props

  if (!profile.cover || !profile.cover.length) {
    return <div />
  }

  useEffect(() => {
    new Swiper('.home-slider', {
      slidesPerView: 1,
      spaceBetween: 0,
      centeredSlides: true,
      loop: false,
      speed: 1500,
      parallax: true,
      /*
      autoplay: {
          delay: 5000,
      },
      */
      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      // Navigation arrows
      navigation: {
        nextEl: '#homeNext',
        prevEl: '#homePrev',
      },
    })
  })

  return (
    <div className="swiper-container home-slider multi-slider">
      <div className="swiper-wrapper">
        {profile.cover.map((item, key) => (
          <div
            className="swiper-slide bg-cover dark-overlay"
            style={{ backgroundImage: `url(${item.url})` }}
            key={key}
          >
            <div className="container h-100">
              <div
                className="d-flex h-100 text-white overlay-content align-items-center"
                data-swiper-parallax="-500"
              >
                <div className="w-100">
                  <div className="row">
                    <div className="col-lg-6">
                      <Avatar
                        {...profile}
                        size="avatar-xl"
                        classNameTitle="text-white display-3 font-weight-bold mb-3"
                      />
                      <p className="my-4">
                        <Truncate lines={2}>{profile.description}</Truncate>
                      </p>
                      <FormModal
                        professional={profile}
                        className="btn btn-outline-light d-none d-sm-inline-block"
                      />
                    </div>
                  </div>

                  <div className="row mt-3 mt-md-5">
                    {profile.url ? (
                      <div className="col-md-4 mb-2 mb-md-0">
                        <a
                          className="media text-reset text-decoration-none hover-animate"
                          href={profile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="icon-rounded bg-white opacity-7 mr-4">
                            <i className="fa fa-globe text-dark h3 pt-1"></i>
                          </div>
                          <div className="media-body">
                            <h5>Website</h5>
                            <div className="">{profile.url}</div>
                          </div>
                        </a>
                      </div>
                    ) : null}
                    <div className="d-none col-md-4 mb-2 mb-md-0">
                      <a
                        className="media text-reset text-decoration-none hover-animate"
                        href="#"
                      >
                        <div className="icon-rounded bg-white opacity-7 mr-4">
                          <i className="fa fa-map-marker-alt text-dark h3 pt-1"></i>
                        </div>
                        <div className="media-body">
                          <h5>Holidays</h5>
                          <div className="badge badge-light">from $1,245</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="swiper-pagination swiper-pagination-white"></div>
      <div className="swiper-nav d-none d-lg-block">
        <div className="swiper-button-prev" id="homePrev"></div>
        <div className="swiper-button-next" id="homeNext"></div>
      </div>
    </div>
  )
}
