/**
 * @file Configurations for the app.
 */

import dotenv from 'dotenv'
import { description, homepage, version } from '../package.json'

dotenv.config()

export default {
  // Version number.
  version: `${version}${process.env.NODE_ENV === 'production' ? '' : `-${(process.env.NODE_ENV ?? 'development').substring(0, 3)}`}`,

  // Build number.
  buildNumber: process.env.BUILD_NUMBER ?? 'local',

  // HTML metadata.
  meta: {
    // Fallback default window title.
    title: 'React Static Starter Kit',

    // Short description of the app.
    description,

    // App URL.
    url: homepage,
  },
}
