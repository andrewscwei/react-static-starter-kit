/**
 * @file Configurations for the app. These values are computed at buildtime and passed to the
 *       runtime environment as a global variable named `__APP_CONFIG__`.
 */

import dotenv from 'dotenv'
import { description, homepage, version } from '../package.json'

dotenv.config()

export default {
  // Version number.
  version: `${version}${process.env.NODE_ENV !== 'development' ? '' : `-${(process.env.NODE_ENV ?? 'development').substring(0, 3)}`}`,

  // Build number.
  buildNumber: process.env.BUILD_NUMBER ?? 'local',

  // HTML metadata.
  meta: {
    // Fallback window title.
    title: 'React Static Starter Kit',

    // Fallback metadata description.
    description,

    // Fully qualified URL of the app in production.
    url: homepage,
  },
}
