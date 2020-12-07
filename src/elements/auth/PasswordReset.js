import React from 'react'
import { Formik } from 'formik'
import { Redirect } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { useAsync } from '../../utils/hooks'
import { ErrorMessage } from '../../components/lib'

export default (props) => {
  const { resetPassword } = useAuth()
  const { isLoading, isSuccess, isError, error, run } = useAsync()

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
      initialValues={{ email: '' }}
      validate={(values) => {
        const errors = {}
        if (!values.email) {
          errors.email = 'Voer je e-mailadres in.'
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Geen geldig e-mailadres.'
        }
        return errors
      }}
      onSubmit={(values) => run(resetPassword(values))}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit}>
          {renderField('E-mailadres', 'email', {
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
          })}

          <button
            className="btn btn-lg btn-block btn-primary"
            type="submit"
            disabled={isLoading}
          >
            Wachtwoord Resetten
          </button>

          {isError ? <ErrorMessage error={error} /> : null}
        </form>
      )}
    </Formik>
  )
}
