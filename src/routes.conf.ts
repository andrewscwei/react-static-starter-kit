/**
 * @file Route definitions for React router.
 */

import { ComponentType } from 'react'
import About from './containers/About'
import Home from './containers/Home'
import NotFound from './containers/NotFound'

type RouteConfig = {
  component: ComponentType
  exact?: boolean
  path: string
}

export default [{
  component: Home,
  exact: true,
  path: '/',
}, {
  component: About,
  exact: true,
  path: '/about',
}, {
  component: Home,
  exact: true,
  path: '/ja',
}, {
  component: About,
  exact: true,
  path: '/ja/about',
}, {
  component: NotFound,
  path: '*',
}] as RouteConfig[]
