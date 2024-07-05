/**
 * @file I18n config.
 */

import { loadTranslations, type I18nConfig } from '@lib/i18n'
import { tryOrUndefined } from '@lib/utils/tryOrUndefined'
import { LOCALE_CHANGE_STRATEGY } from './app.conf'

const { defaultLocale } = __BUILD_ARGS__
const sources = import.meta.glob('./locales/**/*.json', { eager: true })

export const config: I18nConfig = {
  defaultLocale,
  localeChangeStrategy: LOCALE_CHANGE_STRATEGY,
  translations: tryOrUndefined(() => loadTranslations(sources)) ?? { [defaultLocale]: {} },
}
