import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQueryCache } from 'react-query'
import { Formik } from 'formik'
import { Redirect } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { useAsync } from '../../utils/hooks'
import { ErrorMessage } from '../../components/lib'

export default (props) => {
  const { login } = useAuth()
  const { oauthError } = useParams()
  const { isLoading, isSuccess, isError, error, run } = useAsync()
  const cache = useQueryCache()

  // Redirect if Login completed
  if (isSuccess) {
    cache.invalidateQueries('me')

    return <Redirect to="/" />
  }

  // Small abstraction for rendering a field since they only differ in data
  const renderField = (
    label,
    stateSelector,
    formikBag,
    type = 'text',
    withHelperText = false
  ) => (
    <div className="form-group mb-4">
      {withHelperText && (
        <div className="row">
          <div className="col">
            <label className="form-label" htmlFor="password">
              {' '}
              Wachtwoord
            </label>
          </div>
          <div className="col-auto">
            <Link className="form-text small" to="password-reset">
              Wachtwoord vergeten?
            </Link>
          </div>
        </div>
      )}

      {!withHelperText && (
        <label className="form-label" htmlFor={stateSelector}>
          {' '}
          {label}
        </label>
      )}
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
      initialValues={{ email: '', password: '' }}
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
      onSubmit={(values) => run(login(values))}
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
          {renderField(
            'Wachtwoord',
            'password',
            { handleChange, handleBlur, values, errors, touched },
            'password',
            true
          )}

          <div className="form-group mb-4">
            <div className="custom-control custom-checkbox">
              <input
                className="custom-control-input"
                id="loginRemember"
                type="checkbox"
              />
              <label
                className="custom-control-label text-muted"
                htmlFor="loginRemember"
              >
                {' '}
                <span className="text-sm">Ingelogd blijven</span>
              </label>
            </div>
          </div>

          <button
            className="btn btn-lg btn-block btn-primary"
            type="submit"
            disabled={isLoading}
          >
            Inloggen
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
            <i className="fa-2x fa-facebook-f fab btn-social-icon"> </i>Inloggen{' '}
            <span className="d-none d-sm-inline">met Facebook</span>
          </a>

          <a
            href={`${process.env.REACT_APP_API_URL}/connect/google`}
            className="btn btn btn-outline-primary btn-block btn-social mb-3 d-none"
          >
            <i className="fa-2x fa-google fab btn-social-icon"></i>Inloggen{' '}
            <span className="d-none d-sm-inline">met Google</span>
          </a>

          <hr className="my-4" />
          <p className="text-center">
            <small className="text-muted text-center">
              Heb je nog geen account? <Link to="/register">Registreren</Link>
            </small>
          </p>
        </form>
      )}
    </Formik>
  )
}
