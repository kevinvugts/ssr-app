import React from 'react'
import ReactMarkdown from 'react-markdown'
import Link from '../../core/helpers/Link'
import ScrollAnimation from 'react-animate-on-scroll'
import { getImageURL } from '../../core/helpers/Image'
import { IKImage } from 'imagekitio-react'

export default (props) => {
  const renderLayout = () => {
    switch (props.layout) {
      case 'lead':
        return (
          <div className="row">
            <div className="col-xl-8 col-lg-10 mx-auto">
              <ScrollAnimation
                animateIn="animate__animated animate__fadeInUpSmall"
                animateOnce={true}
                offset={0}
                delay={2 * 50}
              >
                <p className="lead mb-5">
                  <ReactMarkdown source={props.content} />
                </p>
              </ScrollAnimation>
            </div>
          </div>
        )

      case 'left':
        return (
          <div className="row">
            <div className="col-lg-6 mr-auto d-flex align-items-center">
              <ScrollAnimation
                className="w-100"
                animateIn="animate__animated animate__kenBurns"
                animateOnce={true}
                offset={0}
                delay={1 * 50}
              >
                <IKImage
                  className="img-fluid mb-3 w-100"
                  path={getImageURL(props.images, 0, 'large').split('/').pop()}
                  srcSet={`
                    https://ik.imagekit.io/hque/tr:w-395,h-222/${getImageURL(
                      props.images,
                      0,
                      'large'
                    )
                      .split('/')
                      .pop()} 425w,

                    https://ik.imagekit.io/hque/tr:w-690,h-388/${getImageURL(
                      props.images,
                      0,
                      'large'
                    )
                      .split('/')
                      .pop()} 768w,

                    https://ik.imagekit.io/hque/tr:w-450,h-253/${getImageURL(
                      props.images,
                      0,
                      'large'
                    )
                      .split('/')
                      .pop()} 1024w,
                    https://ik.imagekit.io/hque/tr:w-640,h-360/${getImageURL(
                      props.images,
                      0,
                      'large'
                    )
                      .split('/')
                      .pop()} 1440w,

                  `}
                />
              </ScrollAnimation>
            </div>
            <div className="col-lg-5">
              <ScrollAnimation
                animateIn="animate__animated animate__fadeInUpSmall"
                animateOnce={true}
                offset={0}
                delay={2 * 50}
              >
                <ReactMarkdown source={props.content} />
              </ScrollAnimation>
              <ScrollAnimation
                animateIn="animate__animated animate__fadeInUp"
                animateOnce={true}
                offset={0}
                delay={3 * 50}
              >
                <Link link={props.link} />
              </ScrollAnimation>
            </div>
          </div>
        )

      case 'right':
        return (
          <div className="row">
            <div className="col-lg-5">
              <ReactMarkdown source={props.content} />
              <Link link={props.link} />
            </div>
            <div className="col-lg-6 ml-auto d-flex align-items-center">
              <IKImage
                className="img-fluid mb-3 w-100"
                path={getImageURL(props.images, 0, 'large').split('/').pop()}
                srcSet={`
                https://ik.imagekit.io/hque/tr:w-395,h-222/${getImageURL(
                  props.images,
                  0,
                  'large'
                )
                  .split('/')
                  .pop()} 425w,

                https://ik.imagekit.io/hque/tr:w-690,h-388/${getImageURL(
                  props.images,
                  0,
                  'large'
                )
                  .split('/')
                  .pop()} 768w,

                https://ik.imagekit.io/hque/tr:w-450,h-253/${getImageURL(
                  props.images,
                  0,
                  'large'
                )
                  .split('/')
                  .pop()} 1024w,
                https://ik.imagekit.io/hque/tr:w-640,h-360/${getImageURL(
                  props.images,
                  0,
                  'large'
                )
                  .split('/')
                  .pop()} 1440w,

              `}
              />
            </div>
          </div>
        )

      case 'html':
        return (
          <div className="row">
            <div className="col-lg-10 m-auto">
              <div dangerouslySetInnerHTML={{ __html: props.content }} />
              <Link link={props.link} />
            </div>
          </div>
        )

      default:
        return (
          <div className="row">
            <div className="col-lg-10 m-auto">
              <ReactMarkdown source={props.content} />
              <Link link={props.link} />
            </div>
          </div>
        )
    }
  }

  return (
    <section className={`py-5 py-lg-7 ${props.class}`}>
      <div className="container">{renderLayout()}</div>
    </section>
  )
}
