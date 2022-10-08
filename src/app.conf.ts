/**
 * @file Global application config.
 */

export default {
  // Full version string.
  version: `v${__BUILD_ARGS__.version}${!__BUILD_ARGS__.env || __BUILD_ARGS__.env === 'production' ? '' : `-${__BUILD_ARGS__.env.substring(0, 3)}`} (${__BUILD_ARGS__.buildNumber})`,

  // Fallback window title.
  title: 'React Static Starter Kit',

  // Fallback app description.
  description: __BUILD_ARGS__.packageDescription,

  // Fallback app URL.
  url: __BUILD_ARGS__.packageHomepage,
}
