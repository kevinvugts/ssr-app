import React from 'react'

import Router from './core/Router'
//import AppProviders from './context'

import s from './index.scss'

import withStyles from 'isomorphic-style-loader/withStyles'

import { IKContext } from 'imagekitio-react'
import { AuthProvider } from './context/auth'
//import AppContext from './app'

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

// Cause an error thrown when using AppProviders directly I have decided to put the context in the app.js
// TODO: Ideally we want the context to be living in the contex/index.js file but for some odd reason it does not work

const App = () => {
  return (
    <Sentry.ErrorBoundary
      showDialog
      dialogOptions={errorDialogOptions}
      fallback={<p>Fallback page here...</p>}
    >
      <IKContext urlEndpoint={urlEndpoint}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </IKContext>
    </Sentry.ErrorBoundary>
  )
}

export default withStyles(s)(App)
