import React from 'react'

import Router from './core/Router'
//import AppProviders from './context'

import s from './index.scss'

import withStyles from 'isomorphic-style-loader/withStyles'

import { IKContext } from 'imagekitio-react'
import { AuthProvider } from './context/auth'
//import AppContext from './app'

// required parameter to fetch images from image kit
const urlEndpoint = APP_CONFIG.imageKitUrl

import * as Sentry from '@sentry/react'

// Seed
import { errorDialogOptions } from './seed'

Sentry.init({
  dsn:
    'https://5c830ebbb4cf4a17b52cfe47d4830034@o226067.ingest.sentry.io/5550799',
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
