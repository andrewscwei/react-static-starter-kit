/**
 * @file Configuration for both client and server environments.
 */

import dotenv from 'dotenv';

dotenv.config();

export default {
  // Version number.
  version: require('../package.json').version,

  // Build number.
  buildNumber: process.env.BUILD_NUMBER || 0,

  // HTML metadata.
  meta: {
    // Title of the app.
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

  // Config options specific to the `build` task.
  build: {
    // Public path of all loaded assets.
    publicPath: process.env.PUBLIC_PATH || '/',

    // Specifies whether JavaScript and CSS source maps should be generated.
    sourceMap: true,

    // Specifies whether a bundle analyzer report should be generated at the end
    // of the build process.
    analyzer: process.env.ANALYZE_BUNDLE === 'true' ? true : false,
  },
};
