import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import ReactPlayer from 'react-player/lazy'
import Link from '../../core/helpers/Link'
import { isMobile } from 'react-device-detect'
import { translateEndpoint } from '../../core/helpers/Image'
import { getImageURL } from '../../core/helpers/Image'
import { IKImage } from 'imagekitio-react'

export default (props) => {
  const source = () => {
    return props.media ? translateEndpoint(props.media.url) : ''
  }

  const renderLayout = () => {
    switch (props.layout) {
      case 'hero':
        return (
          <section className="hero hero-home dark-overlay">
            <ScrollAnimation
              animateIn="animate__animated animate__kenBurns"
              animateOnce={true}
              offset={0}
              className="bg-image"
            >
              {isMobile ? (
                props.fallbackImage && (
                  <IKImage
                    className="img-fluid mb-3 w-100 react-player video"
                    path={getImageURL(props.fallbackImage, 0, 'large')
                      .split('/')
                      .pop()}
                    srcSet={`
                    https://ik.imagekit.io/hque/tr:w-425,h-395/${getImageURL(
                      props.fallbackImage,
                      0,
                      'large'
                    )
                      .split('/')
                      .pop()} 425w,

                    https://ik.imagekit.io/hque/tr:w-768,h-600/${getImageURL(
                      props.fallbackImage,
                      0,
                      'large'
                    )
                      .split('/')
                      .pop()} 768w,

                    https://ik.imagekit.io/hque/tr:w-1024,h-600/${getImageURL(
                      props.fallbackImage,
                      0,
                      'large'
                    )
                      .split('/')
                      .pop()} 1024w,
                    https://ik.imagekit.io/hque/tr:w-1440,h-600/${getImageURL(
                      props.fallbackImage,
                      0,
                      'large'
                    )
                      .split('/')
                      .pop()} 1440w,
                      https://ik.imagekit.io/hque/tr:w-2560,h-600/${getImageURL(
                        props.fallbackImage,
                        0,
                        'large'
                      )
                        .split('/')
                        .pop()} 2560,
                  `}
                  />
                )
              ) : (
                <ReactPlayer
                  className="react-player dark-overlay"
                  url={source()}
                  key={props.id}
                  controls={false}
                  loop={true}
                  volume={0}
                  muted={true}
                  playing={true}
                  width="100%"
                  height="100%"
                  stopOnUnmount={true}
                />
              )}
            </ScrollAnimation>
            <div className="container py-7">
              <div className="overlay-content text-center text-white">
                {props.title ? (
                  <ScrollAnimation
                    animateIn="animate__animated animate__fadeInUpSmall"
                    animateOnce={true}
                    delay={1 * 50}
                  >
                    <h1 className="display-1 font-weight-bold text-shadow mb-0">
                      {props.title}
                    </h1>
                  </ScrollAnimation>
                ) : null}
                {props.subTitle ? (
                  <ScrollAnimation
                    animateIn="animate__animated animate__fadeInUp"
                    animateOnce={true}
                    delay={2 * 50}
                  >
                    <h3 className="font-weight-light text-shadow mb-3">
                      {props.subTitle}
                    </h3>
                  </ScrollAnimation>
                ) : null}
                {props.link ? (
                  <ScrollAnimation
                    animateIn="animate__animated animate__fadeInUp"
                    animateOnce={true}
                    delay={3 * 50}
                  >
                    <Link link={props.link} />
                  </ScrollAnimation>
                ) : null}
              </div>
            </div>
          </section>
        )
      default:
        return (
          <section>
            <div className="container">
              <div className="row">
                <div className="col-xl-10 mx-auto">
                  <ScrollAnimation
                    animateIn="animate__animated animate__kenBurns"
                    animateOnce={true}
                    offset={0}
                  >
                    <div className="player-wrapper">
                      <ReactPlayer
                        className="react-player"
                        key={props.id}
                        url={source()}
                        controls={true}
                        width="100%"
                        height="100%"
                        stopOnUnmount={true}
                        pip={true}
                        playsinline={true}
                      />
                    </div>
                  </ScrollAnimation>
                </div>
              </div>
            </div>
          </section>
        )
    }
  }

  return renderLayout()
}
