import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'

import { BrowserRouter } from 'react-router-dom'

// If we pre-render react code, we have to use hydrate method - otherwise we will get an error in the console
ReactDOM.hydrate(
  <BrowserRouter>
    <App {...window.APP_STATE} />
  </BrowserRouter>,
  document.getElementById('app')
)
