/**
 * @file Route definitions for React router.
 */

import { ComponentType } from 'react'
import About from './containers/About'
import Home from './containers/Home'
import NotFound from './containers/NotFound'

type RouteConfig = {
  component: ComponentType
  path: string
}

export default [{
  component: Home,
  path: '/',
}, {
  component: About,
  path: '/about',
}, {
  component: Home,
  path: '/ja',
}, {
  component: About,
  path: '/ja/about',
}, {
  component: NotFound,
  path: '*',
}] as RouteConfig[]
