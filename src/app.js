import React from 'react'

import Router from './core/Router'
//import AppProviders from './context'

import s from './index.scss'

import withStyles from 'isomorphic-style-loader/withStyles'

import { IKContext } from 'imagekitio-react'
import { AuthProvider } from './context/auth'
//import AppContext from './app'

import {
  ReactQueryConfigProvider,
  QueryCache,
  ReactQueryCacheProvider,
} from 'react-query'

import { hydrate } from 'react-query/hydration'

// required parameter to fetch images from image kit
const urlEndpoint = 'https://ik.imagekit.io/hque'

import * as Sentry from '@sentry/react'

// Seed
import { errorDialogOptions } from './seed'

Sentry.init({
  dsn:
    'https://7b55b0029fae444f96f94f5d1860d80c@o226067.ingest.sentry.io/5455847',
  // integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  // tracesSampleRate: 1.0,
})

const queryConfig = {
  queries: {
    useErrorBoundary: true,
    retry(failureCount, error) {
      if (error.status === 404) return false
      else if (failureCount < 2) return true
      else return false
    },
  },
}

// const dehydratedState =
//   window !== null && window !== undefined
//     ? JSON.parse(JSON.stringify(window.__REACT_QUERY_INITIAL_QUERIES__))
//     : null

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
})

// Cause an error thrown when using AppProviders directly I have decided to put the context in the app.js
// TODO: Ideally we want the context to be living in the contex/index.js file but for some odd reason it does not work

const App = () => {
  // We use this effect in order to omit checks for window or process.browser since app is already being generatedon the server side
  // Another option would be to move this code the client.js
  React.useEffect(() => {
    const dehydratedState = JSON.stringify(
      window.__REACT_QUERY_INITIAL_QUERIES__
    )
    hydrate(queryCache, JSON.parse(dehydratedState))
  })

  return (
    <Sentry.ErrorBoundary
      showDialog
      dialogOptions={errorDialogOptions}
      fallback={<p>Fallback page here...</p>}
    >
      <IKContext urlEndpoint={urlEndpoint}>
        <ReactQueryCacheProvider queryCache={queryCache}>
          <ReactQueryConfigProvider config={queryConfig}>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </ReactQueryConfigProvider>
        </ReactQueryCacheProvider>
      </IKContext>
    </Sentry.ErrorBoundary>
  )
}

export default withStyles(s)(App)
