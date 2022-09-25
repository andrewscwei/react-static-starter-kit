/**
 * @file Configuration for both client and server environments.
 */

import dotenv from 'dotenv'
import path from 'path'
import requireDir from 'require-dir'
import { description, homepage, version } from '../package.json'

dotenv.config()

export default {
  // Version number.
  version,

  // Build number.
  buildNumber: process.env.BUILD_NUMBER || 0,

  // HTML metadata.
  meta: {
    // Fallback default window title (the window title should be set by individual contianers for
    // localization support).
    title: 'React Static Starter Kit',

    // Short description of the app.
    description,

    // App URL.
    url: homepage,
  },

  translations: requireDir(path.resolve('./config/locales')),
}
