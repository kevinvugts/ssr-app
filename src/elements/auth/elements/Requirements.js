import React from 'react'

const Requirement = ({ htmlFor, isvalid, validMessage, invalidMessage }) => (
  <label
    htmlFor={htmlFor}
    className={`d-block ${!isvalid ? `invalid` : `valid`}`}
  >
    <i
      className={`fa fa-check ${!isvalid ? `text-gray-300` : `text-primary`}`}
    ></i>
    <span className="ml-2">{!isvalid ? invalidMessage : validMessage}</span>
  </label>
)

export default ({ long, number }) => (
  <section className="strength-meter small">
    <h6>Wachtwoord vereisten</h6>
    <Requirement
      htmlFor="password"
      isvalid={long}
      invalidMessage="Een lang wachtwoord is veiliger, minstens 8 tekens."
      validMessage="Perfect, dit is lang genoeg voor ons."
    />
    <Requirement
      htmlFor="password"
      isvalid={number}
      invalidMessage="Met cijfers en letters maak je het sterker."
      validMessage="Super, nu is hij complex."
    />
  </section>
)
