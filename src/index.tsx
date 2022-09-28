import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Worker from 'worker-loader!./workers/web'
import App from './App'
import translations from './locales'
import { I18nRouterProvider } from './providers/i18n'
import useDebug from './utils/useDebug'

window.__VERSION__ = `v${__CONFIG__.version}/${__CONFIG__.buildNumber}`

const debug = useDebug()

const worker = new Worker()
worker.postMessage({ message: 'Marco' })
worker.addEventListener('message', event => {
  const message = event.data.message
  debug('Receiving message from worker...', 'OK', message)
  worker.terminate()
})

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = createRoot(document.getElementById('app')!)
app.render(
  <BrowserRouter>
    <I18nRouterProvider defaultLocale={'en'} translations={translations}>
      <App/>
    </I18nRouterProvider>
  </BrowserRouter>
)

debug('Rendering app...', 'OK')
