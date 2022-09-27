declare module '*.svg'
declare module '*.jpg'
declare module '*.png'
declare module '*.module.css'

// Typing for app config.
declare const __APP_CONFIG__: typeof import('../config/app.conf').default

// Web workers.
declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export default WebpackWorker
}

// Custom window properties.
interface Window {
  __INITIAL_STATE__?: Record<string, any>
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: () => void
}
