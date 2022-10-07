/**
 * @file Build arguments computed at buildtime and passed to the runtime environment as a global
 *       variable named `__BUILD_ARGS__`.
 */

import dotenv from 'dotenv'
import path from 'path'
import { description as packageDescription, homepage as packageHomepage, version as packageVersion } from '../package.json'

dotenv.config()

export { packageVersion, packageHomepage, packageDescription }

/**
 * Indicates if `NODE_ENV` is "development".
 */
export const isDev = process.env.NODE_ENV === 'development'

/**
 * Version number.
 */
export const version = `${packageVersion}${!isDev ? '' : `-${(process.env.NODE_ENV ?? 'development').substring(0, 3)}`}`

/**
 * Build number.
 */
export const buildNumber = process.env.BUILD_NUMBER ?? 'local'

/**
 * Input directory of source files to compile.
 */
export const inputDir = path.join(__dirname, '../', 'src')

/**
 * Output directory of the built files.
 */
export const outputDir = path.join(__dirname, '../', 'build')

/**
 * Specifies whether the bundle analyzer should be enabled while building.
 */
export const useBundleAnalyzer = process.env.npm_config_analyze === 'true'

/**
 * Specifies whether HTML/JS/CSS minifications should be disabled while building.
 */
export const skipOptimizations = process.env.NODE_ENV === 'development' || process.env.npm_config_raw === 'true'

/**
 * Specifies the port to use during development.
 */
export const devPort = Number(process.env.PORT ?? 8080)

/**
 * Public path for static assets.
 */
export const publicPath = process.env.PUBLIC_PATH ?? '/'
