import React from 'react'
import ReactMarkdown from 'react-markdown'
import Link from '../../core/helpers/Link'
import ScrollAnimation from 'react-animate-on-scroll'
import { getImageURL } from '../../core/helpers/Image'
import { IKImage } from 'imagekitio-react'

export default (props) => {
  return (
    <section className="hero-home dark-overlay">
      <ScrollAnimation
        animateIn="animate__animated animate__kenBurns"
        animateOnce={true}
        offset={0}
        className="bg-image"
      >
        <IKImage
          alt="bg"
          className="bg-image"
          path={getImageURL(props.image).split('/').pop()}
          srcSet={`
            https://ik.imagekit.io/hque/tr:w-425,h-416/${getImageURL(
              props.image
            )
              .split('/')
              .pop()} 425w,

            https://ik.imagekit.io/hque/tr:w-768,h-600/${getImageURL(
              props.image
            )
              .split('/')
              .pop()} 768w,

            https://ik.imagekit.io/hque/tr:w-1024,h-600/${getImageURL(
              props.image
            )
              .split('/')
              .pop()} 1024w,
            https://ik.imagekit.io/hque/tr:w-1680,h-600/${getImageURL(
              props.image
            )
              .split('/')
              .pop()} 1440w,
            https://ik.imagekit.io/hque/tr:w-1680,h-600/${getImageURL(
              props.image
            )
              .split('/')
              .pop()} 2560w
          `}
        />
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
          <ScrollAnimation
            animateIn="animate__animated animate__fadeInUp"
            animateOnce={true}
            delay={2 * 50}
          >
            <ReactMarkdown source={props.content} />
          </ScrollAnimation>
          <ScrollAnimation
            animateIn="animate__animated animate__fadeInUp"
            animateOnce={true}
            delay={3 * 50}
          >
            <Link link={props.link} />
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
