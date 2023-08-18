/**
 * @file Runtime application config.
 */

import { I18nConfig, loadTranslations } from '../lib/i18n'
import { tryOrUndefined } from '../lib/utils'

/**
 * Full version string.
 */
export const VERSION = `v${__BUILD_ARGS__.version}+build.${__BUILD_ARGS__.buildNumber}`

/**
 * Value for the `theme-color` meta tag.
 */
export const THEME_COLOR = '#15141a'

/**
 * Value for the `color` attribute of the `mask-icon` meta tag.
 */
export const MASK_ICON_COLOR = '#000'

/**
 * Public path for static assets (with trailing slash if needed).
 */
export const PUBLIC_PATH = __BUILD_ARGS__.publicPath

/**
 * Base URL of the app.
 */
export const BASE_URL = __BUILD_ARGS__.baseURL

/**
 * Base path of the router (i.e. the `basename` property).
 */
export const BASE_PATH = __BUILD_ARGS__.basePath

/**
 * I18n config.
 */
export const I18N_CONFIG: I18nConfig = {
  defaultLocale: __BUILD_ARGS__.defaultLocale,
  localeChangeStrategy: 'path',
  translations: tryOrUndefined(() => loadTranslations(require.context('./locales', true, /^.*\.json$/))) ?? {},
}
