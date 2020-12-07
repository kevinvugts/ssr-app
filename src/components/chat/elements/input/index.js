/** @flow */

import React from 'react'
import { Formik } from 'formik'
import useAxios from 'axios-hooks'

const defaultProps = {
  channel: {
    id: 1,
  },
}

/**
 * Render a chat item element.
 * @constructor
 * @param {object} props                    - The properties object.
 * @return {html}                           - The html <div.card /> element.
 */
export default (instanceProps) => {
  const props = { ...defaultProps, ...instanceProps }

  const [, sendPost] = useAxios(
    {
      url: '/messages',
      method: 'POST',
    },
    {
      manual: true,
    }
  )

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    sendPost({
      data: {
        ...values,
        channel: props.channel.id,
      },
    })
      .then((res) => {
        resetForm()
      })
      .catch((e) => {
        // Handle error.
        setSubmitting(false)
      })
  }

  const renderDefault = () => (
    <Formik
      initialValues={{ channel: props.channel, body: '' }}
      validate={(values) => {
        const errors = {}
        // if (!values.identifier) {
        //   errors.identifier = 'Voer je e-mailadres in.';
        // } else if (
        //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.identifier)
        // ) {
        //   errors.identifier = 'Geen geldig e-mailadres.';
        // }
        return errors
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
        <form onSubmit={handleSubmit} className="w-100">
          <div className="input-group">
            <input
              name="body"
              autocomplete="off"
              type="text"
              className="form-control"
              placeholder="Type een bericht"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.body}
            />
            <div className="input-group-append">
              <button
                className="btn btn-secondary"
                type="submit"
                disabled={isSubmitting}
              >
                <i className="fa fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  )

  return renderDefault()
}
