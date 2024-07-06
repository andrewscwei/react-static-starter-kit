/**
 * @file Runtime application config.
 */

/**
 * Value for the `theme-color` meta tag.
 */
export const THEME_COLOR = '#15141a'

/**
 * Value for the `color` attribute of the `mask-icon` meta tag.
 */
export const MASK_ICON_COLOR = '#000'

/**
 * Default locale.
 */
export const DEFAULT_LOCALE = import.meta.env.VITE_DEFAULT_LOCALE ?? 'en'

/**
 * Specifies how locale will be changed:
 * 1. `action`: Locale is changed by dispatching an action.
 * 2. `path`: Locale is changed by altering the path of the URL.
 * 3. `query`: Locale is changed by altering the query parameters of the URL.
 */
export const LOCALE_CHANGE_STRATEGY = 'path'
