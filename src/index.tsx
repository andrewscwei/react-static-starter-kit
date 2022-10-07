import React from 'react'
import { createRoot } from 'react-dom/client'
import Worker from 'worker-loader!./workers/web'
import App from './App'
import appConf from './app.conf'
import useDebug from './utils/useDebug'

if (process.env.NODE_ENV === 'development') window.localStorage.debug = 'app*'
window.__VERSION__ = appConf.version

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
app.render(<App/>)

debug('Rendering app...', 'OK')
