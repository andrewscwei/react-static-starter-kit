declare const __APP_CONFIG__: Readonly<{ [key: string]: any }>

declare const __I18N_CONFIG__: Readonly<{
  defaultLocale: string
  locales: string
  dict: TranslationDataDict
}>

declare module '*.svg'

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker
}

interface TranslationData { [key: string]: TranslationData | string }
type TranslationDataDict = Record<string, TranslationData>

interface Window {
  __INITIAL_STATE__?: Record<string, any>
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: () => void
  snapSaveState?: () => void
}
