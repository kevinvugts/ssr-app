/* eslint-disable no-control-regex, no-useless-escape */

import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Formik } from 'formik'
import { Redirect } from 'react-router-dom'
import Requirements from './elements/Requirements'
import { useAuth } from '../../context/auth'
import { useAsync } from '../../utils/hooks'
import { ErrorMessage } from '../../components/lib'

export default (props) => {
  const { isLoading, isSuccess, isError, error, run } = useAsync()
  const { oauthError } = useParams()

  const [validPassword, setValidPassword] = useState({
    longEnough: false,
    hasNumber: false,
  })

  const passwordRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  )
  const { register } = useAuth()

  // Small abstraction for rendering a field since they only differ in data
  const renderField = (label, stateSelector, formikBag, type = 'text') => (
    <div className="form-group">
      <label className="form-label" htmlFor={stateSelector}>
        {label}
      </label>
      <input
        type={type}
        name={stateSelector}
        className="form-control"
        onChange={formikBag.handleChange}
        onBlur={formikBag.handleBlur}
        value={formikBag.values[stateSelector]}
      />

      {formikBag.errors[stateSelector] &&
        formikBag.touched[stateSelector] &&
        formikBag.errors[stateSelector]}
    </div>
  )

  //Redirect if Register completed
  if (isSuccess) {
    return <Redirect to="/kies-je-branche" />
  }

  // Render
  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
      }}
      validate={(values) => {
        const errors = {}

        if (!values.username) {
          errors.username = 'Voer een gebruikersnaam in.'
        }

        if (!values.firstName) {
          errors.firstName = 'Voer uw voornaam in.'
        }

        if (!values.lastName) {
          errors.lastName = 'Voer uw achternaam in.'
        }

        if (!values.email) {
          errors.email = 'Voer uw e-mailadres in.'
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Geen geldig e-mailadres.'
        }

        if (Object.values(validPassword).some((v) => v === false)) {
          errors.password = 'Het wachtwoord voldoet niet aan de eisen'
        }

        values.password.length < 8
          ? setValidPassword((prev) => ({ ...prev, longEnough: false }))
          : setValidPassword((prev) => ({ ...prev, longEnough: true }))
        !passwordRegex.test(values.password)
          ? setValidPassword((prev) => ({ ...prev, hasNumber: false }))
          : setValidPassword((prev) => ({ ...prev, hasNumber: true }))

        return errors
      }}
      onSubmit={(values) => run(register(values))}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        isValid,
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-6">
              {renderField('Voornaam', 'firstName', {
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
              })}
            </div>

            <div className="col-6">
              {renderField('Achternaam', 'lastName', {
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
              })}
            </div>
          </div>

          {renderField('Gebruikersnaam', 'username', {
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
          })}
          {renderField('E-mailadres', 'email', {
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
          })}
          {renderField(
            'Wachtwoord',
            'password',
            { handleChange, handleBlur, values, errors, touched },
            'password'
          )}

          <div className="form-group mb-4">
            <Requirements
              long={validPassword.longEnough}
              number={validPassword.hasNumber}
            />
          </div>

          <button
            className="btn btn-lg btn-block btn-primary"
            type="submit"
            disabled={isLoading || !isValid}
          >
            Registreren
          </button>

          {isError || oauthError ? (
            <ErrorMessage error={error || oauthError} />
          ) : null}

          <hr className="my-3 hr-text letter-spacing-2" data-content="OF" />

          <a
            href={`${process.env.REACT_APP_API_URL}/connect/facebook`}
            rel="noreferrer noopener"
            target="_blank"
            className="btn btn btn-outline-primary btn-block btn-social mb-3"
          >
            <i className="fa-2x fa-facebook-f fab btn-social-icon"> </i>
            Registeren <span className="d-none d-sm-inline">met Facebook</span>
          </a>

          <a
            href={`${process.env.REACT_APP_API_URL}/connect/google`}
            rel="noreferrer noopener"
            target="_blank"
            className="btn btn btn-outline-primary btn-block btn-social mb-3 d-none"
          >
            <i className="fa-2x fa-google fab btn-social-icon"></i>Registreren{' '}
            <span className="d-none d-sm-inline">via Google</span>
          </a>

          <hr className="my-4" />
          <p className="text-center">
            <small className="text-muted text-center">
              Heb je al een account? <Link to="/login">Inloggen</Link>
            </small>
          </p>
        </form>
      )}
    </Formik>
  )
}
