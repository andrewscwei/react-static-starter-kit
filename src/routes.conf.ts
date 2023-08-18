/**
 * @file Client router config.
 */

import { RouteObject } from 'react-router'
import { generateLocalizedRoutes } from '../lib/i18n'
import { i18nConfig } from './locales'

const routes: RouteObject[] = [{
  path: '/',
  index: true,
  lazy: () => import('./ui/pages/home'),
}, {
  path: '/quote',
  lazy: () => import('./ui/pages/quote'),
}, {
  path: '*',
  lazy: () => import('./ui/pages/notFound'),
}]

export default generateLocalizedRoutes(routes, i18nConfig)
