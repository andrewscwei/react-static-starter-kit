/**
 * @file Runtime application config.
 */

export default {
  /**
   * Full version string.
   */
  version: `v${__BUILD_ARGS__.version}${!__BUILD_ARGS__.env || __BUILD_ARGS__.env === 'production' ? '' : `-${__BUILD_ARGS__.env.substring(0, 3)}`}+build.${__BUILD_ARGS__.buildNumber}`,

  /**
   * Fallback window title.
   */
  title: 'React Static Starter Kit',

  /**
   * Fallback app description.
   */
  description: 'React static app starter kit',

  /**
   * Fallback app URL.
   */
  url: 'https://andrewscwei.github.io/react-static-starter-kit/',

  /**
   * Default locale.
   */
  defaultLocale: 'en',

  /**
   * Base path of the router (i.e. the `basename` property).
   */
  basePath: __BUILD_ARGS__.basePath,
}
