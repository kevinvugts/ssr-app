/** @flow */

import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { Formik, Form as FormikForm, Field } from 'formik'
import * as Yup from 'yup'
import ScrollAnimation from 'react-animate-on-scroll'
import { useMutation } from 'react-query'
import { client } from '../utils/api-client'
import { ToastMessage } from '../components/lib'
import logo from '../assets/images/logo.svg'

const FormSchema = Yup.object().shape({
  email: Yup.string()
    .email('Dit lijkt geen geldig e-mail')
    .required('We hebben je e-mail nodig om je iets te laten weten.'),
})

export default props => {
  const history = useHistory()

  const [mutate, { isLoading, isError, isSuccess, error }] = useMutation(
    values =>
      client('deals/newsletter', {
        data: values,
      })
  )

  if (isSuccess) {
    return history.push('/nieuwsbrief-inschrijving-bedankt')
  }

  return (
    <footer className="position-relative z-index-10 d-print-none">
      <div className="py-6 bg-gray-200 text-muted">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 mb-5 mb-lg-0">
              <ScrollAnimation
                animateIn="animate__animated animate__fadeInUpSmall"
                animateOnce={true}
                offset={0}
                delay={0 * 50}
              >
                <Link to="/">
                  <img src={logo} height="40" alt="HQUE" />
                </Link>
                <p>Redefining spaces.</p>
                <ul className="list-inline">
                  <li className="list-inline-item">
                    <a
                      className="text-muted text-hover-primary"
                      href="https://www.facebook.com/hquespace/"
                      target="_blank"
                      title="facebook"
                      rel="noreferrer noopener"
                    >
                      <i className="fab fa-facebook"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a
                      className="text-muted text-hover-primary"
                      href="https://www.instagram.com/hquespace/"
                      target="_blank"
                      title="instagram"
                      rel="noreferrer noopener"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a
                      className="text-muted text-hover-primary"
                      href="https://www.linkedin.com/company/hque/"
                      target="_blank"
                      title="linkedin"
                      rel="noreferrer noopener"
                    >
                      <i className="fab fa-linkedin"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a
                      className="text-muted text-hover-primary"
                      href="https://nl.pinterest.com/hquespace/"
                      target="_blank"
                      title="pinterest"
                      rel="noreferrer noopener"
                    >
                      <i className="fab fa-pinterest"></i>
                    </a>
                  </li>
                </ul>
              </ScrollAnimation>
            </div>
            <div className="col-lg-2 mb-5 mb-lg-0">
              <ScrollAnimation
                animateIn="animate__animated animate__fadeInUpSmall"
                animateOnce={true}
                offset={0}
                delay={1 * 50}
              >
                <h6 className="text-uppercase text-dark mb-3">Menu</h6>
                <ul className="list-unstyled">
                  <li>
                    <Link className="text-muted" to="/collections">
                      Inspiratie
                    </Link>
                  </li>
                  <li>
                    <Link className="text-muted" to="/members">
                      Professionals
                    </Link>
                  </li>
                  <li>
                    <Link className="text-muted" to="/lid-worden">
                      Lid worden
                    </Link>
                  </li>
                  <li>
                    <Link className="text-muted" to="/over">
                      Over HQUE
                    </Link>
                  </li>
                </ul>
              </ScrollAnimation>
            </div>
            <div className="col-lg-3 col-md-6 mb-5 mb-lg-0">
              <ScrollAnimation
                animateIn="animate__animated animate__fadeInUpSmall"
                animateOnce={true}
                offset={0}
                delay={2 * 50}
              >
                <h6 className="text-uppercase text-dark mb-3">Contact</h6>
                <address>
                  Stationsplein 3<br />
                  4811 BB Breda <br />
                  Nederland
                </address>
                <ul className="list-unstyled">
                  <li>
                    <a
                      href="mailto:hello@hque.space"
                      className="link"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      hello@hque.space
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+31850185665"
                      className="link"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      +31(0)85 018 5665
                    </a>
                  </li>
                </ul>
              </ScrollAnimation>
            </div>
            <div className="col-lg-4">
              <ScrollAnimation
                animateIn="animate__animated animate__fadeInUpSmall"
                animateOnce={true}
                offset={0}
                delay={3 * 50}
              >
                <h6 className="text-uppercase text-dark mb-3">HQUE updates</h6>
                <p className="mb-3">
                  Iedere week de coolste inspiratie ontvangen voor je workplace?
                </p>
                <Formik
                  initialValues={{
                    email: '',
                  }}
                  validationSchema={FormSchema}
                  onSubmit={mutate}
                >
                  {({ errors, touched, isValid }) => (
                    <FormikForm noValidate id="newsletter-form">
                      <Form.Group className="input-group mb-3">
                        <Field
                          name="email"
                          id="subscribe-email"
                          type="email"
                          className="form-control border-right-0"
                          placeholder="Je e-mailadres"
                          aria-label="Je e-mailadres"
                        />
                        <div className="input-group-append">
                          <Button
                            className="btn border-left-0 rounded-1 text-light"
                            type="submit"
                            disabled={isLoading || !isValid}
                          >
                            {' '}
                            <i className="fa fa-paper-plane text"></i>
                          </Button>
                        </div>
                        {errors.email && touched.email ? (
                          <div className="invalid-feedback d-block">
                            {errors.email}
                          </div>
                        ) : null}
                      </Form.Group>
                    </FormikForm>
                  )}
                </Formik>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 font-weight-light bg-secondary text-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-left">
              <p className="h6 text-sm mb-md-0">
                &copy; {new Date().getFullYear()} HQUE&reg; All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
      {isError && error.message && (
        <ToastMessage
          title="Er is iets misgegaan"
          error={error.message}
          customStyles={{ bottom: '20px', top: 'unset', right: '20px' }}
        />
      )}
    </footer>
  )
}
