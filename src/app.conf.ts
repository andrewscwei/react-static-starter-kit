/**
 * @file Configuration for both client and server environments.
 */

import dotenv from 'dotenv'

dotenv.config()

export default {
  // Version number.
  version: require('../package.json').version,

  // Build number.
  buildNumber: process.env.BUILD_NUMBER || 0,

  // HTML metadata.
  meta: {
    // Fallback default window title (the window title should be set by individual contianers for
    // localization support).
    title: 'React Static Starter Kit',

    // Short description of the app.
    description: require('../package.json').description,

    // Search keywords.
    keywords: require('../package.json').keywords,

    // App URL.
    url: require('../package.json').homepage,
  },

  // Supported locales. First locale is the default locale.
  locales: ['en', 'ja'],
}
