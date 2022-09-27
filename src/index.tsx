import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Worker from 'worker-loader!./workers/web'
import App from './App'
import { I18nRouterProvider } from './providers/i18n'
import './styles/global.css'
import debug from './utils/debug'

if (process.env.NODE_ENV === 'development') {
  window.localStorage.debug = 'app*,worker*'
}

window.__VERSION__ = `v${__CONFIG__.version}/${__CONFIG__.buildNumber}`

const worker = new Worker()
worker.postMessage({ message: 'Hello, world!' })
worker.addEventListener('message', event => debug(event.data.message))

const translations = (() => {
  const req = require.context('./locales', true, /^.*\.json$/)
  return req.keys().reduce((prev, curr) => ({
    ...prev,
    [curr.replace('./', '').replace('.json', '')]: req(curr),
  }), {})
})()

const container = document.getElementById('app')
if (!container) throw Error('Unable to find DOM element to mount app in')

const root = createRoot(container)
root.render(
  <BrowserRouter>
    <I18nRouterProvider defaultLocale='en' translations={translations}>
      <App/>
    </I18nRouterProvider>
  </BrowserRouter>
)
