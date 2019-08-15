/**
 * @file Route definitions for React router.
 */

import About from '../containers/About';
import Home from '../containers/Home';
import NotFound from '../containers/NotFound';

export function getLocaleFromPath(path) {
  const locales = __I18N_CONFIG__.locales;
  const normalizedPath = path.replace(/\/*$/, '') + '/';
  const possibleLocale = normalizedPath.split('/')[1];

  if (~locales.indexOf(possibleLocale)) {
    return possibleLocale;
  }
  else {
    return locales[0];
  }
}

export function getLocalizedPath(path, locale = __I18N_CONFIG__.defaultLocale) {
  const t = path.split('/').filter(v => v);

  if (t.length > 0 && __I18N_CONFIG__.locales.indexOf(t[0]) >= 0) {
    t.shift();
  }

  switch (locale) {
  case __I18N_CONFIG__.defaultLocale:
    return `/${t.join('/')}`;
  default:
    return `/${locale}/${t.join('/')}`;
  }
}

export default [{
  path: '/',
  exact: true,
  component: Home,
}, {
  path: '/about',
  exact: true,
  component: About,
}, {
  path: '/ja',
  exact: true,
  component: Home,
}, {
  path: '/ja/about',
  exact: true,
  component: About,
}, {
  path: '*',
  component: NotFound,
}];
