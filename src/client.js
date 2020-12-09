import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'
import StyleContext from 'isomorphic-style-loader/StyleContext'

import { BrowserRouter } from 'react-router-dom'

import {
  QueryCache,
  ReactQueryCacheProvider,
  ReactQueryConfigProvider,
} from 'react-query'
import { hydrate } from 'react-query/hydration'

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss())
  return () => removeCss.forEach(dispose => dispose())
}

// If we pre-render react code, we have to use hydrate method - otherwise we will get an error in the console
const root = document.getElementById('app')

const dehydratedState = JSON.stringify(window.__REACT_QUERY_INITIAL_QUERIES__)

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
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

hydrate(queryCache, JSON.parse(dehydratedState))

ReactDOM.hydrate(
  <ReactQueryCacheProvider queryCache={queryCache}>
    <ReactQueryConfigProvider config={queryConfig}>
      <BrowserRouter>
        <StyleContext.Provider value={{ insertCss }}>
          <App />
        </StyleContext.Provider>
      </BrowserRouter>
    </ReactQueryConfigProvider>
  </ReactQueryCacheProvider>,

  root
)
