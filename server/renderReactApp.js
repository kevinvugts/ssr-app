import React from 'react'
import ReactDOMServer from 'react-dom/server' // allows us to render react components tree on the server
import { StaticRouter } from 'react-router-dom'

import Html from '../src/core/Html' // our index.html file where we inject the server side rendered components
import App from '../src/app' // our component which will be rendered on the server

const renderReact = app => {
  // if what the user requested is not available in the public folder, we'll send back the index.html
  app.get('*', async (req, res) => {
    const scripts = ['vendor.js', 'client.js']

    const initialState = { initialText: 'rendered on the server' }

    // renderToStaticMarkup omits all the HTML attributes React adds to the DOM during rendering
    const appMarkup = ReactDOMServer.renderToString(
      <StaticRouter location={req.url} context={{}}>
        <App {...initialState} />
      </StaticRouter>
    )
    const html = ReactDOMServer.renderToStaticMarkup(
      <Html
        children={appMarkup}
        scripts={scripts}
        initialState={initialState}
      />
    )

    res.send(`${html}`)
  })
}

export default renderReact
