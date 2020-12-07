import React from 'react'

import Router from './core/Router'
import { AuthProvider } from './context/auth'

import './index.scss'

const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}

export default App
