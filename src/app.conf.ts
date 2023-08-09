/**
 * @file Runtime application config.
 */

/**
 * Full version string.
 */
export const VERSION = `v${__BUILD_ARGS__.version}+build.${__BUILD_ARGS__.buildNumber}`

/**
 * Fallback window title.
 */
export const TITLE = 'React Static Starter Kit'

/**
 * Fallback app description.
 */
export const DESCRIPTION = 'React static app starter kit'

/**
 * Fallback app URL.
 */
export const URL = 'https://andrewscwei.github.io/react-static-starter-kit/'

/**
 * Default locale.
 */
export const DEFAULT_LOCALE = 'en'

/**
 * Base path of the router (i.e. the `basename` property).
 */
export const BASE_PATH = __BUILD_ARGS__.basePath

/**
 * Specifies whether debug is enabled.
 */
export const DEBUG_ENABLED = process.env.NODE_ENV === 'development'

/**
 * Enabled debug channels in the client.
 */
export const DEBUG_CHANNELS = ['app']
