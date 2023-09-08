/**
 * @file Routes config.
 */

import type { RouteObject } from 'react-router'

export const config: RouteObject[] = [{
  id: 'root',
  lazy: () => import('./ui/pages/index'),
  children: [{
    path: '/',
    index: true,
    lazy: () => import('./ui/pages/home'),
  }, {
    path: '/quote',
    lazy: () => import('./ui/pages/quote'),
  }, {
    path: '*',
    lazy: () => import('./ui/pages/notFound'),
  }],
}]
