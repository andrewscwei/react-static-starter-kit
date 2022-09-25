import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import Worker from 'worker-loader!./workers/web'
import App from './App'
import { I18nProvider } from './modules/i18n'
import createStore from './store'
import globalStyle from './styles/global'
import * as theme from './styles/theme'
import debug from './utils/debug'

if (process.env.NODE_ENV === 'development') {
  window.localStorage.debug = 'app*,worker*'
}

const worker = new Worker()
worker.postMessage({ message: 'Hello, world!' })
worker.addEventListener('message', event => debug(event.data.message))

const translations = (() => {
  // In development, use require context for all locale translation files so they can be watched by
  // Webpack.
  if (process.env.NODE_ENV === 'development') {
    const req = require.context('../config/locales', true, /^.*\.json$/)
    return req.keys().reduce((prev, curr) => ({
      ...prev,
      [curr.replace('./', '').replace('.json', '')]: req(curr),
    }), {})
  }
  else {
    return __APP_CONFIG__.translations
  }
})()

const container = document.getElementById('app')
if (!container) throw Error('Unable to find DOM element to mount app in')

const GlobalStyle = createGlobalStyle`${globalStyle}`

const root = createRoot(container)
root.render(
  <>
    <GlobalStyle/>
    <Provider store={createStore()}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <I18nProvider defaultLocale='en' translations={translations}>
            <App/>
          </I18nProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </>
)
