import { initClient } from '@lib/dom'
import { createDebug } from '@lib/utils/createDebug'
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import { config as i18nConf } from './i18n.conf'
import { config as routesConf } from './routes.conf'
import { App } from './ui/App'

const { basePath } = __BUILD_ARGS__

export default initClient(({ routes }) => (
  <App>
    <RouterProvider router={createBrowserRouter(routes, { basename: basePath })}/>
  </App>
), {
  i18n: i18nConf,
  routes: routesConf,
})

const worker = new Worker(new URL('./workers/web.ts', import.meta.url), { type: 'module' })
worker.postMessage({ message: 'Marco' })
worker.addEventListener('message', event => {
  const debug = createDebug()
  const message = event.data.message
  debug('Receiving message from worker...', 'OK', message)
  worker.terminate()
})
