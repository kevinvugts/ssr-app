/* eslint-disable no-control-regex, no-useless-escape */

import React, { useState } from 'react'
import { Formik } from 'formik'
import { Toast } from 'react-bootstrap'
import useAxios from 'axios-hooks'
import Requirements from './elements/Requirements'

export default (props) => {
  const [long, longEnough] = useState(false)
  const [number, hasNumber] = useState(false)
  const [errorMessage, setErrorMessage] = useState({ title: '', message: '' })
  const [show, setShow] = useState(false)
  const passwordRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  )

  const [, doUpdate] = useAxios(
    {
      url: '/users/me',
      method: 'PUT',
    },
    {
      manual: true,
    }
  )

  const onSubmit = (values, { setSubmitting }) => {
    doUpdate({
      data: values,
    })
      .then((res) => {
        // TODO: Update local me.
        setSubmitting(false)
      })
      .catch((e) => {
        // Handle error.
        setErrorMessage({
          title: 'Er is iets mis gegaan',
          message: 'Wachtwoord bijwerken mislukt.',
        })
        setShow(true)
        setSubmitting(false)
      })
  }

  const renderMessage = () => (
    <div
      className="position-fixed mx-auto"
      style={{
        top: '60px',
        right: 'calc(50% - 100px)',
        width: '200px',
        zIndex: '1070',
      }}
    >
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          <strong className="mr-auto">{errorMessage.title}</strong>
        </Toast.Header>
        <Toast.Body>{errorMessage.message}</Toast.Body>
      </Toast>
    </div>
  )

  return (
    <>
      <Formik
        initialValues={{ password: '' }}
        validate={(values) => {
          values.password.length < 8 ? longEnough(false) : longEnough(true)
          !passwordRegex.test(values.password)
            ? hasNumber(false)
            : hasNumber(true)
        }}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="row pt-4">
              <div className="form-group col-md-6">
                <label className="form-label" htmlFor="password">
                  Wachtwoord
                </label>
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  id="password"
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="form-group col-md-12">
                <Requirements long={long} number={number} />
              </div>
            </div>

            <button
              className="btn btn-primary text-light"
              type="submit"
              disabled={!longEnough || !hasNumber || isSubmitting}
            >
              Opslaan
            </button>

            {renderMessage()}
          </form>
        )}
      </Formik>
    </>
  )
}
