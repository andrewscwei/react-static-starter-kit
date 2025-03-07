/// <reference types="vite/client" />

interface ImportMetaEnv {
  /* Build args */
  readonly BASE_PATH: string
  readonly BUILD_NUMBER: string
  readonly DEBUG_MODE: string
  readonly DEFAULT_LOCALE: string
  readonly DEFAULT_METADATA: Record<string, string>
  readonly VERSION: string

  /* App env */
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
