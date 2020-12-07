/** @flow */

import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { Formik, Form as FormikForm, Field } from 'formik'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import Avatar from '../../../elements/avatar'

import { client } from '../../../../utils'
import { useMutation } from 'react-query'
import { useAuth } from '../../../../context/auth'
import { motion } from 'framer-motion'
import { ErrorMessage } from '../../../../components/lib'

const stepForm = {
  active: { opacity: 1, x: 0 },
  inactive: { opacity: 0, x: '-100%' },
}

const defaultProps = {
  professional: {
    name: '',
  },
  show: false,
  label: 'Stuur een bericht',
  className: 'btn btn-primary text-light',
}

const FormSchema = Yup.object().shape({
  fullName: Yup.string().required('We weten graag je naam.'),
  companyName: Yup.string(),
  email: Yup.string()
    .email('Dit lijkt geen geldig e-mail')
    .required('We hebben je e-mail nodig om je iets te laten weten.'),
  phone: Yup.string(),
  question: Yup.string().required('Je bent vergeten je vraag in te vullen.'),
})

/**
 * Render a chat item element.
 * @constructor
 * @param {object} props                    - The properties object.
 * @return {html}                           - The html <div.card /> element.
 */
export default (instanceProps) => {
  const props = { ...defaultProps, ...instanceProps }
  const history = useHistory()
  const [show, setShow] = useState(props.show)

  const [mutate, { isError, error }] = useMutation(
    (values) =>
      client('deals', {
        data: { ...values, professionalId: props.professional.id },
        method: 'POST',
      }),
    {
      onError: (err, variables, recover) =>
        typeof recover === 'function' ? recover() : null,
      onSettled: () => history.push('/bedankt?professional='+props.professional.slug),
    }
  )

  const { me } = useAuth()

  return (
    <>
      <Button
        variant="outline"
        className={props.className}
        onClick={() => setShow(!show)}
      >
        {props.label}
      </Button>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="overflow-hidden"
        size="lg"
        centered
      >
        <Formik
          initialValues={{
            fullName: me ? `${me.firstName} ${me.lastName}` : '',
            companyName: me ? me.companyName : '',
            email: me ? me.email : '',
            phone: me ? me.phone : '',
            question: '',
          }}
          validationSchema={FormSchema}
          onSubmit={mutate}
        >
          {({ errors, touched, isSubmitting }) => (
            <>
              <motion.div
                className="container-fluid"
                variants={stepForm}
                initial={'open'}
                animate={'active'}
              >
                <FormikForm noValidate>
                  <Modal.Header closeButton className="p-4">
                    <Avatar {...props.professional} />
                  </Modal.Header>

                  <Modal.Body>
                    <div className="row">
                      <div className="col-12">
                        <h5 className="my-4">Stel ons een vraag</h5>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="fullName">
                            Volledige naam
                          </Form.Label>
                          <Field
                            disabled={me && me.firstName}
                            name="fullName"
                            id="fullName"
                            className="form-control"
                          />
                          {errors.fullName && touched.fullName ? (
                            <div className="invalid-feedback d-block">
                              {errors.fullName}
                            </div>
                          ) : null}
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="companyName">
                            Bedrijfsnaam
                          </Form.Label>
                          <Field
                            disabled={me && me.companyName}
                            name="companyName"
                            id="companyName"
                            className="form-control"
                          />
                          {errors.companyName && touched.companyName ? (
                            <div className="invalid-feedback d-block">
                              {errors.companyName}
                            </div>
                          ) : null}
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="email">E-mail</Form.Label>
                          <Field
                            disabled={me && me.email}
                            name="email"
                            id="email"
                            className="form-control"
                          />
                          {errors.email && touched.email ? (
                            <div className="invalid-feedback d-block">
                              {errors.email}
                            </div>
                          ) : null}
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="phone">
                            Telefoonnummer
                          </Form.Label>
                          <Field
                            disabled={me && me.phone}
                            name="phone"
                            id="phone"
                            className="form-control"
                          />
                          {errors.phone && touched.phone ? (
                            <div className="invalid-feedback d-block">
                              {errors.phone}
                            </div>
                          ) : null}
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="question">Je vraag</Form.Label>
                          <Field
                            name="question"
                            id="question"
                            className="form-control"
                            as="textarea"
                          />
                          {errors.question && touched.question ? (
                            <div className="invalid-feedback d-block">
                              {errors.question}
                            </div>
                          ) : null}
                        </Form.Group>
                      </div>
                    </div>
                  </Modal.Body>

                  <Modal.Footer className="p-4">
                    <Button variant="text" onClick={() => setShow(false)}>
                      Annuleren
                    </Button>
                    <Button
                      variant="primary"
                      className="btn btn-primary text-light"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Versturen
                    </Button>
                  </Modal.Footer>

                  {isError && <ErrorMessage error={error} />}
                </FormikForm>
              </motion.div>
            </>
          )}
        </Formik>
      </Modal>
    </>
  )
}
