/**
 * @file Route definitions for React router.
 */

import About from '../containers/About';
import Home from '../containers/Home';
import NotFound from '../containers/NotFound';
import Preview from '../containers/Preview';

export function getLocaleFromPath(path: string): string {
  const locales = __INTL_CONFIG__.locales;
  const possibleLocale = path.split('/')[1];

  if (~locales.indexOf(possibleLocale)) {
    return possibleLocale;
  }
  else {
    return locales[0];
  }
}

export default [{
  path: '/',
  exact: true,
  component: Home,
}, {
  path: '/about',
  component: About,
}, {
  path: '/preview',
  component: Preview,
}, {
  path: '/ja',
  exact: true,
  component: Home,
}, {
  path: '/ja/about',
  component: About,
}, {
  path: '*',
  component: NotFound,
}];
