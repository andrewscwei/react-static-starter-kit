/**
 * @file Runtime application config.
 */

/**
 * Fallback app title.
 */
export const TITLE = 'React Static Starter Kit'

/**
 * Fallback app description.
 */
export const DESCRIPTION = 'An experimental React static app starter kit.'

/**
 * Value for the `theme-color` meta tag.
 */
export const THEME_COLOR = '#15141a'

/**
 * Value for the `color` attribute of the `mask-icon` meta tag.
 */
export const MASK_ICON_COLOR = '#000'

/**
 * Specifies how locale will be changed:
 * 1. `action`: Locale is changed by dispatching an action.
 * 2. `path`: Locale is changed by altering the path of the URL.
 * 3. `query`: Locale is changed by altering the query parameters of the URL.
 */
export const LOCALE_CHANGE_STRATEGY = 'path'

/**
 * Base path of the router (i.e. the `basename` property).
 */
export const BASE_PATH = import.meta.env.VITE_BASE_PATH ?? '/'

/**
 * Default locale.
 */
export const DEFAULT_LOCALE = import.meta.env.VITE_DEFAULT_LOCALE ?? 'en'

export const PUBLIC_PATH = import.meta.env.BASE_URL
