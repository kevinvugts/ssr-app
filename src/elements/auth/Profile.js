/* eslint-disable  react-hooks/exhaustive-deps */

import React from 'react'
import { Formik } from 'formik'
import * as auth from '../../auth-provider'
import { client, difference } from '../../utils'
import { useMutation, useQuery, useQueryCache } from 'react-query'
import { ToastMessage } from '../../components/lib'
import axios from 'axios'
import Loading from '../Loading'

// React FilePond
import * as FilePond from 'filepond'

import { registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize
)

export default (props) => {
  const queryCache = useQueryCache()

  const { data: me, isLoading: isMeLoading } = useQuery('me', async () =>
    client('users/me', { token: await auth.getToken() })
  )

  const [, setFiles] = React.useState([])

  const [mutate, { isLoading, isError, error }] = useMutation(
    async (values) =>
      client('users/me', {
        data: values,
        method: 'PUT',
        token: await auth.getToken(),
      }),
    {
      onError: (err, variables, recover) =>
        typeof recover === 'function' ? recover() : null,
      onSettled: () => {
        queryCache.invalidateQueries('me')
      },
    }
  )

  React.useEffect(() => {
    async function initPond() {
      await FilePond.create(document.getElementById('avatarUpload'), {
        labelIdle: `Drag & Drop your picture or <span class="filepond--label-action">Browse</span>`,
        imagePreviewHeight: 170,
        imageCropAspectRatio: '1:1',
        imageResizeTargetWidth: 150,
        imageResizeTargetHeight: 150,
        stylePanelLayout: 'compact circle',
        styleLoadIndicatorPosition: 'center bottom',
        styleProgressIndicatorPosition: 'right bottom',
        styleButtonRemoveItemPosition: 'left bottom',
        styleButtonProcessItemPosition: 'right bottom',
        maxFiles: 1,
        files:
          me && me.avatar
            ? [{ source: me.avatar.url, options: { type: 'local' } }]
            : [],
        server: {
          load: async (source, load, error, progress, abort, headers) => {
            const cancelToken = axios.CancelToken.source().token

            let config = {
              onUploadProgress: (e) => {
                progress(e.lengthComputable, e.loaded, e.total)
              },
              headers: {
                'content-type': 'multipart/form-data',
                'Cache-Control': 'no-cache',
              },
              crossdomain: true,
              cancelToken,
              responseType: 'blob',
            }

            await axios
              .get(source, config)
              .then(({ data }) => load(data))
              .catch((err) => {
                if (axios.isCancel(err)) {
                  console.log('USER CANCELLED THE REQUEST BEFORE COMPLETED')
                  abort()
                }

                console.log('ERROR', err)
                error('Er ging iets fout tijdens het ophalen van jouw avatar')
              })
          },
          process: async (
            fieldName,
            file,
            metadata,
            load,
            error,
            progress,
            abort,
            transfer,
            options
          ) => {
            console.log('FILE', file)
            const formData = new FormData()
            const cancelToken = axios.CancelToken
            const source = cancelToken.source()

            formData.append('files', file)
            formData.append('ref', 'user')
            formData.append('refId', me ? me.id : '')
            formData.append('field', 'avatar')
            formData.append('source', 'users-permissions')

            const token = await auth.getToken()

            let config = {
              onUploadProgress: (e) => {
                progress(e.lengthComputable, e.loaded, e.total)
              },
              headers: {
                'content-type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
              },
              cancelToken: source.token,
            }

            axios
              .post(`${process.env.REACT_APP_API_URL}/upload`, formData, config)
              .then((res) => queryCache.invalidateQueries('me'))
              .catch((error) => {
                if (axios.isCancel(error)) {
                  console.log('USER CANCELLED THE REQUEST BEFORE COMPLETED')
                  abort()
                }

                console.log('ERROR', error)
              })
          },
        },
      })

      if (!isMeLoading) {
        document
          .querySelector('.filepond--root')
          .addEventListener('FilePond:updatefiles', (e) => {
            const files = e.detail.pond.getFiles()

            setFiles(files.map((file) => file.file))
          })
      }
    }

    initPond()
  }, [isMeLoading])

  // important since me can be null and initial values will not be set so we need to hold it with a loading state before rendering on the screen
  if (isMeLoading) {
    return (
      <div className="col-12 h-25 text-center">
        <Loading />
      </div>
    )
  }

  // Formik Initial Values
  const initialValues = {
    companyName: me.companyName || '',
    firstName: me.firstName || '',
    lastName: me.lastName || '',
    email: me.email || '',
    phone: me.phone || '',
  }

  return (
    <Formik
      initialValues={initialValues}
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
      onSubmit={(values) => mutate(difference(values, initialValues))}
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
          <div className="row pt-4">
            <div className="form-group col-md-6">
              <input
                style={{ width: 120, height: 120 }}
                id="avatarUpload"
                type="file"
                className="filepond"
                name="filepond"
                accept="image/png, image/jpeg, image/gif"
              />
            </div>
          </div>
          <div className="row pt-4">
            <div className="form-group col-md-12">
              <label className="form-label" htmlFor="companyName">
                Bedrijfsnaam
              </label>
              <input
                className="form-control"
                type="text"
                name="companyName"
                id="companyName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.companyName}
              />
              {errors.firstName && touched.firstName}
            </div>
            <div className="form-group col-md-6">
              <label className="form-label" htmlFor="firstName">
                Voornaam
              </label>
              <input
                className="form-control"
                type="text"
                name="firstName"
                id="firstName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
              />
              {errors.firstName && touched.firstName}
            </div>
            <div className="form-group col-md-6">
              <label className="form-label" htmlFor="lastName">
                Achternaam
              </label>
              <input
                className="form-control"
                type="text"
                name="lastName"
                id="lastName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
              />
              {errors.lastName && touched.lastName}
            </div>
            <div className="form-group col-md-6">
              <label className="form-label" htmlFor="email">
                E-mailadres
              </label>
              <input
                className="form-control"
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && touched.email}
            </div>
            <div className="form-group col-md-6">
              <label className="form-label" htmlFor="phone">
                Telefoonnummer
              </label>
              <input
                className="form-control"
                type="text"
                name="phone"
                id="phone"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
              />
              {errors.phone && touched.phone}
            </div>
          </div>

          <button
            className="btn btn-primary text-light"
            type="submit"
            disabled={
              isLoading ||
              !isValid ||
              Object.keys(difference(initialValues, values)).length === 0
            }
          >
            Opslaan
          </button>

          {isError && (
            <ToastMessage title="Er is iets misgegaan" error={error} />
          )}
        </form>
      )}
    </Formik>
  )
}
