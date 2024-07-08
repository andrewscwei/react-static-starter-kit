import { initClient } from '@lib/dom'
import { createDebug } from '@lib/utils/createDebug'
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import { BASE_PATH, VERSION } from './app.conf'
import { config as i18nConf } from './i18n.conf'
import { config as routesConf } from './routes.conf'
import { App } from './ui/App'
import WebWorker from './workers/web?worker'

window.__VERSION__ = VERSION

export default initClient(({ routes }) => (
  <App>
    <RouterProvider router={createBrowserRouter(routes, { basename: BASE_PATH })}/>
  </App>
), {
  i18n: i18nConf,
  routes: routesConf,
})

const worker = new WebWorker()
worker.postMessage({ message: 'Marco' })
worker.addEventListener('message', event => {
  const debug = createDebug()
  const message = event.data.message
  debug('Receiving message from worker...', 'OK', message)
  worker.terminate()
})
