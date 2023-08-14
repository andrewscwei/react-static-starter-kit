/**
 * @file Runtime application config.
 */

/**
 * Full version string.
 */
export const VERSION = `v${__BUILD_ARGS__.version}+build.${__BUILD_ARGS__.buildNumber}`

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
 * Default locale.
 */
export const DEFAULT_LOCALE = __BUILD_ARGS__.defaultLocale

/**
 * Location in the URL to infer the current locale, available options are "path"
 * and "query".
 */
export const LOCALE_CHANGE_STRATEGY = 'path'
