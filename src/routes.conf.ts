/**
 * @file Client router config.
 */

import { RouteObject } from 'react-router'
import { generateLocalizedRoutes } from '../lib/i18n'
import { I18N } from './app.conf'

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

export default generateLocalizedRoutes(routes, I18N)
