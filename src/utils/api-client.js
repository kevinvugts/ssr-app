import { queryCache } from 'react-query'
import {
  generateErrorMessageArray,
  generateErrorMessageArrayForPost,
} from './strapi'

async function client(
  endpoint,
  { data, token, headers: customHeaders, ...customConfig } = {}
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  return (
    window
      .fetch(`${APP_CONFIG.apiHost}/${endpoint}`, config)
      .then(async response => {
        if (response.status === 401) {
          queryCache.clear()
          // refresh the page for them
          window.location.assign(window.location)
          return Promise.reject({ message: 'Please re-authenticate.' })
        }

        const data = await response.json()

        if (response.ok) {
          return data
        } else {
          return Promise.reject(data)
        }
      })
      // STRAPI IS ENDING DIFFERENT ERROR RESPONSE WE NEED TO HANDLE IT BETTER
      .catch(error => {
        if (error.message && Array.isArray(error.message)) {
          return Promise.reject(generateErrorMessageArray(error))
        } else if (error.data && error.data.errors) {
          return Promise.reject(generateErrorMessageArrayForPost(error.data))
        } else {
          return Promise.reject(error)
        }
      })
  )
}

export { client }
