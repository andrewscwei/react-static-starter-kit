import { type Translations } from './types'

/**
 * Loads translations from a directory via Webpack `RequireContext`.
 *
 * @param ctx See {@link __WebpackModuleApi.RequireContext}.
 *
 * @returns The translations dictionary.
 */
export function loadTranslations(sources: Record<string, any>): Translations {
  const translations: Translations = {}

  try {
    for (const key in sources) {
      if (!Object.prototype.hasOwnProperty.call(sources, key)) continue

      const phrases = sources[key].default
      const parts = key.replace('./locales', '').split('/').filter(Boolean)

      let t: any = translations

      for (const part of parts) {
        const subkey = part.replace('.json', '')
        t[subkey] = part.endsWith('.json') ? phrases : {}
        t = t[subkey]
      }
    }
  }
  catch (err) {
    console.error('Loading translations...', 'ERR', err)
  }

  return translations
}
