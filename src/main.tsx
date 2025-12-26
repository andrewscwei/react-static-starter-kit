import { BASE_PATH } from '@/app.config.js'
import { App } from '@/App.js'
import { routes } from '@/routes.config.js'
import WebWorker from '@/workers/web.js?worker'
import { debug } from '@lib/debug'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

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

  createRoot(container).render((
    <App>
      <RouterProvider router={createBrowserRouter(routes, { basename: BASE_PATH })}/>
    </App>
  ))

  debug('Initializing client...', 'OK')
}

render()
work()
