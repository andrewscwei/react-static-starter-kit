import Worker from 'worker-loader!./workers/web'
import mountRoot from '../lib/dom/mountRoot'
import { useDebug } from '../lib/utils'
import { VERSION } from './app.conf'
import App from './ui/App'

window.__VERSION__ = VERSION

const debug = useDebug()

const worker = new Worker()
worker.postMessage({ message: 'Marco' })
worker.addEventListener('message', event => {
  const message = event.data.message
  debug('Receiving message from worker...', 'OK', message)
  worker.terminate()
})

mountRoot(App)
