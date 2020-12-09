import React from 'react'
import ReactDOMServer from 'react-dom/server' // allows us to render react components tree on the server
import { StaticRouter } from 'react-router-dom'
import StyleContext from 'isomorphic-style-loader/StyleContext'

import Html from '../src/core/Html' // our index.html file where we inject the server side rendered components
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
        .get(`${APP_CONFIG.apiHost}/pages?slug=${'home'}`)
        .then(res => {
          console.log('RES', res)
          return res.data
        })
        .catch(error => console.log('error', error))
    )

    const dehydratedState = dehydrate(prefetchCache)
    const renderCache = new QueryCache()
    hydrate(renderCache, dehydratedState)
    // End Getting initial data

    const css = new Set() // CSS for all rendered React components
    const insertCss = (...styles) =>
      styles.forEach(style => css.add(style._getCss()))

    const scripts = ['vendor.js', 'client.js']

    // renderToStaticMarkup omits all the HTML attributes React adds to the DOM during rendering
    const appMarkup = ReactDOMServer.renderToString(
      <StaticRouter location={req.url} context={{}}>
        <StyleContext.Provider value={{ insertCss }}>
          <ReactQueryCacheProvider queryCache={renderCache}>
            <ReactQueryConfigProvider config={queryConfig}>
              <App initialData={dehydratedState} />
            </ReactQueryConfigProvider>
          </ReactQueryCacheProvider>
        </StyleContext.Provider>
      </StaticRouter>
    )

    const html = ReactDOMServer.renderToStaticMarkup(
      <Html
        children={appMarkup}
        scripts={scripts}
        initialData={dehydratedState}
        criticalCss={css}
      />
    )

    res.status(200).send(`<!DOCTYPE html>${html}`)
  })
}

export default renderReact
