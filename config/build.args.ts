/**
 * @file Build arguments computed at buildtime and passed to the runtime
 *       environment as global variable `__BUILD_ARGS__`.
 */

import dotenv from 'dotenv'
import path from 'path'
import { version as packageVersion } from '../package.json'

dotenv.config()

/**
 * Specifies whether debug is enabled.
 */
export const debugEnabled = process.env.DEBUG_ENABLED === 'true' || process.env.NODE_ENV === 'development'

/**
 * Enabled debug channels in the client.
 */
export const debugChannels = process.env.DEBUG_CHANNELS?.split(',') || ['app']

/**
 * Version number.
 */
export const version = packageVersion

/**
 * Build number.
 */
export const buildNumber = process.env.BUILD_NUMBER || 'local'

/**
 * Directory of starter kit library source files.
 */
export const libDir = path.join(__dirname, '../', 'lib')

/**
 * Input directory of source files to compile.
 */
export const inputDir = path.join(__dirname, '../', 'src')

/**
 * Output directory of the built files.
 */
export const outputDir = path.join(__dirname, '../', 'build')

/**
 * Specifies whether source maps should be generated.
 */
export const useSourceMaps = process.env.NODE_ENV === 'development'

/**
 * Specifies whether the bundle analyzer should be enabled while building.
 */
export const useBundleAnalyzer = process.env.npm_config_analyze === 'true'

/**
 * Specifies whether HTML/JS/CSS minifications should be disabled while
 * building.
 */
export const skipOptimizations = process.env.NODE_ENV === 'development' || process.env.npm_config_raw === 'true'

/**
 * Specifies the port to use during development.
 */
export const devPort = Number(process.env.PORT || 8080)

/**
 * Public path for static assets.
 */
export const publicPath = process.env.PUBLIC_PATH || '/'

/**
 * Base URL of the app (no trailing `/`).
 */
export const baseUrl = process.env.BASE_URL || ''

/**
 * Base path of the router (i.e. the `basename` property).
 */
export const basePath = process.env.BASE_PATH || '/'
