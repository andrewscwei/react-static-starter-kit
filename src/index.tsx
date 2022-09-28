import React from 'react'
import { createRoot } from 'react-dom/client'
import Worker from 'worker-loader!./workers/web'
import App from './App'
import useDebug from './utils/useDebug'

const debug = useDebug()

window.__VERSION__ = `v${__CONFIG__.version}/${__CONFIG__.buildNumber}`

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
