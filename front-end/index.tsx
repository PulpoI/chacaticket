import { createBrowserHistory } from 'history'
import React from 'react'
import { hydrate, render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import * as serviceWorker from './serviceWorker'
import store from './store/store'

import App from './App'

const hist = createBrowserHistory()

const rootElement = document.getElementById('app')
const app = (
  <Provider store={store}>
    <Router history={hist}>
      <ScrollToTop />
      <App />
    </Router>
  </Provider>
)
if (rootElement.hasChildNodes()) {
  hydrate(app, rootElement)
} else {
  render(app, rootElement)
}

serviceWorker.register()
