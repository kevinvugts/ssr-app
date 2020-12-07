import React from 'react'
import Loader from 'react-loader-spinner'
import ScrollAnimation from 'react-animate-on-scroll'

export default ({ tiny }) => {
  return (
    <ScrollAnimation
      animateIn="animate__animated animate__fadeIn"
      animateOut="animate__animated animate__fadeOut"
      offset={0}
    >
      <div
        className="d-flex flex-direction-column align-items-center justify-content-center"
        style={{ height: tiny || '75vh' }}
      >
        <Loader type="TailSpin" color="black" height={40} width={40} />
      </div>
    </ScrollAnimation>
  )
}
