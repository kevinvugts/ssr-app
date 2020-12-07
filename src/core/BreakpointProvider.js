import React, { useState, useEffect, createContext, useContext } from 'react'

const defaultQueries = {
  xs: '(max-width: 576px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
}

const defaultValue = {}

const BreakpointContext = createContext(defaultValue)

/* Causing errors on the frontend side at the moment, please read and fix:
 *
 * Warning: React has detected a change in the order of Hooks called by null.
 * Help tutorial: https://kentcdodds.com/blog/dont-call-a-react-function-component
 *
 */
const BreakpointProvider = ({ children, queries }) => {
  const [queryMatch, setQueryMatch] = useState({})

  useEffect(() => {
    const mediaQueryLists = {}
    const keys = Object.keys(queries)
    let isAttached = false

    const handleQueryListener = () => {
      const updatedMatches = keys.reduce((acc, media) => {
        acc[media] = !!(
          mediaQueryLists[media] && mediaQueryLists[media].matches
        )
        return acc
      }, {})
      setQueryMatch(updatedMatches)
    }

    if (window && window.matchMedia) {
      const matches = {}
      keys.forEach((media) => {
        if (typeof queries[media] === 'string') {
          mediaQueryLists[media] = window.matchMedia(queries[media])
          matches[media] = mediaQueryLists[media].matches
        } else {
          matches[media] = false
        }
      })
      setQueryMatch(matches)
      isAttached = true
      keys.forEach((media) => {
        if (typeof queries[media] === 'string') {
          mediaQueryLists[media].addListener(handleQueryListener)
        }
      })
    }

    return () => {
      if (isAttached) {
        keys.forEach((media) => {
          if (typeof queries[media] === 'string') {
            mediaQueryLists[media].removeListener(handleQueryListener)
          }
        })
      }
    }
  }, [queries])

  return (
    <BreakpointContext.Provider value={queryMatch}>
      {children}
    </BreakpointContext.Provider>
  )
}

function useBreakpoint() {
  const context = useContext(BreakpointContext)
  if (context === defaultValue) {
    throw new Error('useBreakpoint must be used within BreakpointProvider')
  }
  return context
}
export { useBreakpoint, BreakpointProvider, defaultQueries }
