/**
 * @file Runtime application config.
 */

/**
 * Fallback app title.
 */
export const TITLE = __BUILD_ARGS__.title

/**
 * Fallback app description.
 */
export const DESCRIPTION = __BUILD_ARGS__.description

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
