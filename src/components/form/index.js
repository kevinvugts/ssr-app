/** @flow */

import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { Formik, Form as FormikForm, Field } from 'formik'
import * as Yup from 'yup'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'
import { client } from '../../utils/api-client'
import { ErrorMessage } from '../../components/lib'

const FormSchema = Yup.object().shape({
  companyName: Yup.string().required(
    'Enkel bedrijven kunnen bij ons lid worden.'
  ),
  accountUrl: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'De website url lijkt ongeldig, vergeet http:// of https:// niet!'
    )
    .required('Vul een geldige website url in'),
  firstName: Yup.string().required('We weten graag je voornaam.'),
  lastName: Yup.string().required('We weten ook graag je achternaam.'),
  email: Yup.string()
    .email('Dit lijkt geen geldig e-mail')
    .required('We hebben je e-mail nodig om je iets te laten weten.'),
  phone: Yup.string().required('Graag weten we ook je telefoonnummer'),
  comments: Yup.string(),
})

/**
 * Render a chat item element.
 * @constructor
 * @param {object} props                    - The properties object.
 * @return {html}                           - The html <div.card /> element.
 */
export default (instanceProps) => {
  const history = useHistory()
  const [mutate, { isLoading, isError, isSuccess, error }] = useMutation(
    (values) =>
      client('deals/professional', {
        data: values,
      })
  )

  if (isSuccess) {
    history.push('lid-worden-bedankt')
    return null;
  }

  return (
    <Formik
      initialValues={{
        companyName: '',
        accountUrl: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        comments: '',
      }}
      validationSchema={FormSchema}
      onSubmit={(values) => mutate(values)}
    >
      {({ errors, touched, isValid }) => (
        <FormikForm noValidate>
          <div>
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 my-4">
                  <h1>Lid worden</h1>
                  <p>Word een professional op hque.</p>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="companyName">Bedrijfsnaam</Form.Label>
                    <Field
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

                <div className="col-12">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="companyName">Website url</Form.Label>
                    <Field
                      name="accountUrl"
                      id="accountUrl"
                      className="form-control"
                    />
                    {errors.accountUrl && touched.accountUrl ? (
                      <div className="invalid-feedback d-block">
                        {errors.accountUrl}
                      </div>
                    ) : null}
                  </Form.Group>
                </div>

                <div className="col-6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="firstName">Voornaam</Form.Label>
                    <Field
                      name="firstName"
                      id="firstName"
                      className="form-control"
                    />
                    {errors.firstName && touched.firstName ? (
                      <div className="invalid-feedback d-block">
                        {errors.firstName}
                      </div>
                    ) : null}
                  </Form.Group>
                </div>

                <div className="col-6">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="lastName">Achternaam</Form.Label>
                    <Field
                      name="lastName"
                      id="lastName"
                      className="form-control"
                    />
                    {errors.lastName && touched.lastName ? (
                      <div className="invalid-feedback d-block">
                        {errors.lastName}
                      </div>
                    ) : null}
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="email">E-mail</Form.Label>
                    <Field name="email" id="email" className="form-control" />
                    {errors.email && touched.email ? (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    ) : null}
                  </Form.Group>
                </div>

                <div className="col-12">
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="phone">Telefoonnummer</Form.Label>
                    <Field name="phone" id="phone" className="form-control" />
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
                    <Form.Label htmlFor="question">Opmerkingen</Form.Label>
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
            </div>
          </div>

          {isError && <ErrorMessage error={error} />}

          <div className="p-4">
            <Button
              variant="primary"
              className="btn btn-primary text-light"
              type="submit"
              disabled={isLoading || !isValid}
            >
              Aanvragen
            </Button>
          </div>
        </FormikForm>
      )}
    </Formik>
  )
}
