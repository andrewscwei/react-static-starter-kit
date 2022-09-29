declare module '*.svg'
declare module '*.jpg'
declare module '*.png'
declare module '*.module.css'

declare const __CONFIG__: typeof import('../config/app.conf').default

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export default WebpackWorker
}

interface Window {
  __VERSION__: string
}
