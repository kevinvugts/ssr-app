/* eslint-disable no-control-regex, no-useless-escape */

import React from 'react'
import { Formik } from 'formik'
import { Redirect } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { useAsync } from '../../utils/hooks'
import Requirements from './elements/Requirements'
import { ErrorMessage } from '../../components/lib'
import { useParams } from 'react-router-dom'

export default (props) => {
  let { code } = useParams()
  const { newPassword } = useAuth()
  const { isLoading, isSuccess, isError, error, run } = useAsync()

  const [validPassword, setValidPassword] = React.useState({
    longEnough: false,
    hasNumber: false,
  })
  const passwordRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  )

  // Redirect if Login completed
  if (isSuccess) return <Redirect to="/" />

  // Small abstraction for rendering a field since they only differ in data
  const renderField = (label, stateSelector, formikBag, type = 'text') => (
    <div className="form-group mb-4">
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

  return (
    <Formik
      initialValues={{ code, password: '', passwordConfirmation: '' }}
      validate={(values) => {
        const errors = {}
        if (values.password !== values.passwordConfirmation) {
          errors.passwordConfirmation = 'Het wachtwoord komt niet overeen'
        }

        if (!values.password) {
          errors.password = 'Het wachtwoord mag niet leeg zijn'
        }

        if (!values.passwordConfirmation) {
          errors.passwordConfirmation =
            'Het bevestigen van je wachtwoord is verplicht'
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
      onSubmit={(values) => run(newPassword(values))}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid,
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit}>
          {renderField(
            'Wachtwoord',
            'password',
            { handleChange, handleBlur, values, errors, touched },
            'password'
          )}

          {renderField(
            'Bevestig Wachtwoord',
            'passwordConfirmation',
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
            Wachtwoord Resetten
          </button>

          {isError ? <ErrorMessage error={error} /> : null}
        </form>
      )}
    </Formik>
  )
}
