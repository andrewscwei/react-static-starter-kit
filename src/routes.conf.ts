/**
 * @file Client router config.
 */

import { RouteObject } from 'react-router'

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

export default routes
