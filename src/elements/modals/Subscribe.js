import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

export default (props) => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Button variant="none" onClick={handleShow}>
        {props.children}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body closeButton>
          <button
            className="close"
            type="button"
            onClick={handleClose}
            aria-label="Close"
          >
            <span aria-hidden="true">&times; </span>
          </button>
          <Modal.Title>Maak een account aan.</Modal.Title>
          <p>Met een account kun je eenvoudig een wensenlijstje aanmaken.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={handleClose}>
            Nee nog niet
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Registreren
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
