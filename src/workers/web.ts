import { createDebug } from '@lib/utils/createDebug'

const debug = createDebug(undefined, 'worker')

self.addEventListener('message', event => {
  if (event.origin !== __BUILD_ARGS__.publicURL) return

  const message = event.data.message
  debug('Receiving message from app...', 'OK', message)

  if (message === 'Marco') {
    self.postMessage({ message: 'Polo' })
  }
})
