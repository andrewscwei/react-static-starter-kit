import { debug } from '@lib/debug'
import { generateLocalizedRoutes } from '@lib/i18n'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { BASE_PATH } from './app.config.js'
import { i18n } from './i18n.config.js'
import { routes } from './routes.config.js'
import { App } from './ui/App.js'
import WebWorker from './workers/web.js?worker'

function work() {
  const worker = new WebWorker()
  worker.postMessage({ message: 'Marco' })
  worker.addEventListener('message', event => {
    const message = event.data.message
    debug('Receiving message from worker...', 'OK', message)
    worker.terminate()
  })
}

function render() {
  const container = window.document.getElementById('root')

  if (!container) throw Error('Invalid application root')

  const localizedRoutes = generateLocalizedRoutes(routes, i18n)

  createRoot(container).render((
    <App>
      <RouterProvider router={createBrowserRouter(localizedRoutes, { basename: BASE_PATH })}/>
    </App>
  ))

  debug('Initializing client...', 'OK')
}

render()
work()
