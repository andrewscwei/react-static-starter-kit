// Support importing various asset types.
declare module '*.svg'
declare module '*.jpg'
declare module '*.png'

// Typing for app config.
declare const __APP_CONFIG__: typeof import('./app.conf').default

// Web workers.
declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export default WebpackWorker
}

// I18n.
interface TranslationData { [key: string]: TranslationData | string }
type TranslationDataDict = Record<string, TranslationData>

declare const __I18N_CONFIG__: Readonly<{
  defaultLocale: string
  locales: string
  dict: TranslationDataDict
}>

// Custom window properties.
interface Window {
  __INITIAL_STATE__?: Record<string, any>
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: () => void
}
