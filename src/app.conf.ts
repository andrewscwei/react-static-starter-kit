/**
 * @file Runtime application config.
 */

import { type Locale } from '@lib/i18n'

/**
 * Base URL of the app.
 */
export const BASE_URL = import.meta.env.BASE_URL

/**
 * Base path of the router (i.e. the `basename` property).
 */
export const BASE_PATH = import.meta.env.BASE_PATH

/**
 * Absolute public URL for static assets.
 */
export const PUBLIC_URL = import.meta.env.PUBLIC_URL

/**
 * Public path for static assets.
 */
export const PUBLIC_PATH = import.meta.env.PUBLIC_PATH

/**
 * App version.
 */
export const VERSION = `v${import.meta.env.VERSION}+build.${import.meta.env.BUILD_NUMBER}`

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
export const DEFAULT_LOCALE = (import.meta.env.VITE_DEFAULT_LOCALE ?? 'en') as Locale

/**
 * Specifies how locale will be changed:
 * 1. `action`: Locale is changed by dispatching an action.
 * 2. `path`: Locale is changed by altering the path of the URL.
 * 3. `query`: Locale is changed by altering the query parameters of the URL.
 */
export const LOCALE_CHANGE_STRATEGY = 'path'
