import React from 'react'
import { Route, Switch } from 'react-router-dom'
// import loadable from '@loadable/component'

import Header from '../elements/Header'
import Footer from '../elements/Footer'

import loadable from '@loadable/component'

import Loading from '../elements/Loading'

const DefaultPage = loadable(() => import('../pages/Default'), {
  fallback: <Loading />,
})

const variant = 'bg-white text-dark'

export default () => (
  <div className={`page-wrapper ${variant}`}>
    <Header className={`${variant}`} />
    <Switch className="stack">
      <Route path="/home" component={DefaultPage} />
      <Route path="/over" component={() => <p>over ons pagina</p>} />
    </Switch>
    <Footer />
  </div>
)
