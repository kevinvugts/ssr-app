import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import { translateEndpoint } from '../../core/helpers/Image'

export default (props) => {
  const imageURL = () => {
    return props.image ? translateEndpoint(props.image.url) : 'none'
  }

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
              <img className="img-fluid mb-5" src={imageURL()} alt={''} />
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  )
}
