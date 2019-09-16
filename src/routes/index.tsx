/**
 * @file Route definitions for React router.
 */

import Blog from '../containers/Blog';
import BlogPost from '../containers/BlogPost';
import Home from '../containers/Home';
import NotFound from '../containers/NotFound';
import Preview from '../containers/Preview';

export function getLocaleFromPath(path: string): string {
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

export function getLocalizedPath(path: string, locale: string = __I18N_CONFIG__.defaultLocale): string {
  const t = path.split('/').filter((v) => v);

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
  path: '/blog',
  exact: true,
  component: Blog,
}, {
  path: '/blog/:uid',
  component: BlogPost,
}, {
  path: '/preview',
  component: Preview,
}, {
  path: '/ja',
  exact: true,
  component: Home,
}, {
  path: '/ja/blog',
  exact: true,
  component: Blog,
}, {
  path: '/ja/blog/:uid',
  component: BlogPost,
}, {
  path: '*',
  component: NotFound,
}];
