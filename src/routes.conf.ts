/**
 * @file Routes config.
 */

import type { RouteObject } from 'react-router'

export const config: RouteObject[] = [{
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
