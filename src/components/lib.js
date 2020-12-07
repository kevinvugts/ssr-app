import React from 'react'
import { Alert } from 'react-bootstrap'
import { Toast } from 'react-bootstrap'
import Loading from '../elements/Loading'

function FullPageSpinner() {
  return (
    <div
      style={{
        fontSize: '4em',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Loading />
    </div>
  )
}

function FullPageErrorFallback({ error }) {
  return (
    <div
      role="alert"
      style={{
        color: 'red',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p>Uh oh... Er is een probleem opgetreden. Probeer de app te herladen.</p>
      <pre>{error.message}</pre>
    </div>
  )
}

// const errorMessageVariants = {
//   stacked: { display: 'block' },
//   inline: { display: 'inline-block' },
// }

function ErrorMessage({ error, variant = 'stacked', ...props }) {
  const [show, setShow] = React.useState(true)

  function generateErrorMessageComponent() {
    return Array.isArray(error) ? (
      error.map((error, key) => (
        <p className="m-0" key={key}>
          {error}
        </p>
      ))
    ) : (
      <p className="m-0">{error}</p>
    )
  }

  return (
    <Alert
      show={show}
      onClose={() => setShow(false)}
      className="mt-4"
      variant="danger"
      dismissible
      {...props}
    >
      {generateErrorMessageComponent()}
    </Alert>
  )
}

function SuccessMessage({ message, ...props }) {
  return (
    <Alert className="mt-4" variant="success" {...props}>
      {message}
    </Alert>
  )
}

function ToastMessage({ title, error, ...props }) {
  const [show, setShow] = React.useState(error || true)

  function generateErrorMessageComponent() {
    return Array.isArray(error) ? (
      error.map((error, key) => (
        <p className="m-0" key={key}>
          {error}
        </p>
      ))
    ) : (
      <p className="m-0">{error}</p>
    )
  }
  return (
    <div
      className="position-fixed mx-auto"
      style={{
        top: '60px',
        width: '200px',
        zIndex: '1070',
        ...props.customStyles,
      }}
    >
      <Toast
        onClose={() => {
          setShow(false)
          props.resetError()
        }}
        show={show}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className="mr-auto">{title}</strong>
        </Toast.Header>
        <Toast.Body> {generateErrorMessageComponent()}</Toast.Body>
      </Toast>
    </div>
  )
}

export {
  FullPageErrorFallback,
  FullPageSpinner,
  ErrorMessage,
  SuccessMessage,
  ToastMessage,
}
