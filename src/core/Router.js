import React from 'react'
import { Route, Switch } from 'react-router-dom'
// import loadable from '@loadable/component'

import Header from '../elements/Header'
import Footer from '../elements/Footer'

import loadable from '@loadable/component'

const DefaultPage = loadable(() => import('../pages/Default'), {
  fallback: <div>Loading...</div>,
})

const variant = 'bg-white text-dark'

export default () => (
  <div className={`page-wrapper ${variant}`}>
    <Switch className="stack">
      <Route path="*">
        <Header className={`${variant}`} />
        <Switch className="stack">
          <Route path="/hoi" component={DefaultPage} />
        </Switch>
        <Footer />
      </Route>
    </Switch>
  </div>
)
