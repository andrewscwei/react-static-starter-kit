import Worker from 'worker-loader!./workers/web'
import { VERSION } from './app.conf'
import mountRoot from './base/utils/mountRoot'
import useDebug from './base/utils/useDebug'
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
