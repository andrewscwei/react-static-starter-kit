/**
 * @file Routes config.
 */

import type { RouteObject } from 'react-router'
import { ErrorBoundary } from './ui/ErrorBoundary'

export const config: RouteObject[] = [{
  id: 'root',
  ErrorBoundary,
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
