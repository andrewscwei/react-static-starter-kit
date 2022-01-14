// Supports importing assets.
declare module '*.svg'
declare module '*.jpg'
declare module '*.png'

// Supports typing for app config.
declare const __APP_CONFIG__: typeof import('./app.conf').default

// Supports web workers.
declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export default WebpackWorker
}

// Supports I18n.
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
  snapSaveState?: () => void
}
