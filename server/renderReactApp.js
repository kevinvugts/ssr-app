import React from 'react'
import ReactDOMServer from 'react-dom/server' // allows us to render react components tree on the server
import { StaticRouter } from 'react-router-dom'
import StyleContext from 'isomorphic-style-loader/StyleContext'
import { Helmet } from 'react-helmet'

import App from '../src/app' // our component which will be rendered on the server

import axios from 'axios'

import {
  ReactQueryCacheProvider,
  ReactQueryConfigProvider,
  QueryCache,
} from 'react-query'
import { dehydrate, hydrate } from 'react-query/hydration'

const renderReact = async app => {
  // if what the user requested is not available in the public folder, we'll send back the index.html
  app.get('*', async (req, res) => {
    console.log('HITTING ROUTE ON SERVER')

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
    // Getting initial Data
    const prefetchCache = new QueryCache({
      defaultConfig: {
        queries: {
          staleTime: 1000 * 60,
          cacheTime: 1000 * 60,
          refetchOnWindowFocus: false,
        },
      },
    })

    // Prefetches the data an stores it into queryCache so the frontend already has the data
    // Does re-render on route change which is not desired
    // TODO: Figure out how we can prevent refetching on route change so also the server.js does not make unneccessary requests
    await prefetchCache.prefetchQuery(['pages', 'home'], () =>
      axios
        .get(`${APP_CONFIG.apiHost}/pages?slug=home`)
        .then(res => {
          console.log('res.data', res.data)
          return res.data
        })
        .catch(error => console.log('error', error))
    )
    const dehydratedState = dehydrate(prefetchCache)
    const renderCache = new QueryCache({
      defaultConfig: {
        queries: {
          staleTime: 1000 * 60,
          cacheTime: 1000 * 60,
          refetchOnWindowFocus: false,
        },
      },
    })

    hydrate(renderCache, dehydratedState)
    // End Getting initial data

    const css = new Set() // CSS for all rendered React components
    const insertCss = (...styles) =>
      styles.forEach(style => css.add(style._getCss()))

    // const scripts = ['vendor.js', 'client.js']

    // renderToStaticMarkup omits all the HTML attributes React adds to the DOM during rendering
    const appMarkup = ReactDOMServer.renderToString(
      <StaticRouter location={req.url} context={{}}>
        <StyleContext.Provider value={{ insertCss }}>
          <ReactQueryCacheProvider queryCache={renderCache}>
            <ReactQueryConfigProvider config={queryConfig}>
              <Helmet>
                <title>Hello World</title>
                <link rel="canonical" href="https://www.tacobell.com/" />
              </Helmet>
              <App initialData={dehydratedState} />
            </ReactQueryConfigProvider>
          </ReactQueryCacheProvider>
        </StyleContext.Provider>
      </StaticRouter>
    )

    const helmet = Helmet.renderStatic()

    res
      .status(200)
      .send(renderFullPage(appMarkup, helmet, css, dehydratedState))
  })
}

const renderFullPage = (html, helmet, criticalCss, initialData) => {
  return `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
      <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.style.toString()}
        ${helmet.script.toString()}

        <style>${[...criticalCss].join('')}</style>

        <body ${helmet.bodyAttributes.toString()}>
          <div id="app">${html}</div>

        ${initialData &&
          `<script>
              window.__REACT_QUERY_INITIAL_QUERIES__ = ${JSON.stringify(
                initialData
              )}
          </script>`}


        <script src="client.js" type="text/javascript"></script>
        <script src="vendor.js" type="text/javascript"></script>
      </body>
    </html>
    `
}

export default renderReact
