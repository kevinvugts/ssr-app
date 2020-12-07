import React from 'react'
import {
  ReactQueryConfigProvider,
  QueryCache,
  ReactQueryCacheProvider,
} from 'react-query'

// Context
import { IKContext } from 'imagekitio-react'
import { AuthProvider } from './auth'
import AppContext from './app'
import * as Sentry from '@sentry/react'
// import { Integrations } from '@sentry/tracing'

// Seed
import { errorDialogOptions } from '../seed'

// utils
import { LocalStorageWorker } from '../utils'

import { BrowserRouter as Router } from 'react-router-dom'
import FallbackPage from '../pages/error/Error'

Sentry.init({
  dsn:
    'https://7b55b0029fae444f96f94f5d1860d80c@o226067.ingest.sentry.io/5455847',
  // integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  // tracesSampleRate: 1.0,
})

// required parameter to fetch images from image kit
const urlEndpoint = 'https://ik.imagekit.io/hque'

const queryConfig = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry(failureCount, error) {
      if (error.status === 404) return false
      else if (failureCount < 2) return true
      else return false
    },
  },
}

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60,
    },
  },
})

function AppProviders({ children }) {
  const lsw = new LocalStorageWorker()

  return (
    <Sentry.ErrorBoundary
      showDialog
      dialogOptions={errorDialogOptions}
      fallback={
        <Router>
          <FallbackPage />
        </Router>
      }
    >
      <IKContext urlEndpoint={urlEndpoint}>
        <ReactQueryCacheProvider queryCache={queryCache}>
          <ReactQueryConfigProvider config={queryConfig}>
            <AuthProvider>
              <AppContext.Provider value={{ lsw }}>
                {children}
              </AppContext.Provider>
            </AuthProvider>
          </ReactQueryConfigProvider>
        </ReactQueryCacheProvider>
      </IKContext>
    </Sentry.ErrorBoundary>
  )
}

export default AppProviders
