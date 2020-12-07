import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'
import StyleContext from 'isomorphic-style-loader/StyleContext'

import { BrowserRouter } from 'react-router-dom'

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss())
  return () => removeCss.forEach(dispose => dispose())
}

// If we pre-render react code, we have to use hydrate method - otherwise we will get an error in the console
ReactDOM.hydrate(
  <BrowserRouter>
    <StyleContext.Provider value={{ insertCss }}>
      <App />
    </StyleContext.Provider>
  </BrowserRouter>,
  document.getElementById('app')
)
