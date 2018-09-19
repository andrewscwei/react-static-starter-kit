/**
 * @file Utility functions for the build process.
 */

import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import requireDir from 'require-dir';

const cwd = path.join(__dirname, '../../');

export function getRoutesFromDir(dir, baseDir = dir) {
  const pages = fs.readdirSync(dir);
  let out = [];

  pages.forEach((fileName) => {
    if ((/(^|\/)\.[^/.]/g).test(fileName)) return;

    const basename = path.basename(fileName, '.jsx');
    const ignorePattern = ['404', 'NotFound', 'Root', 'App'];
    const indexPattern = ['index', 'home'];

    // Ignore files with certain names (i.e. NotFound.jsx). No need to generate a
    // route for these files.
    if (~ignorePattern.indexOf(basename)) return;

    // Check if directory. If it is, crawl its contents to determine sub-routes.
    if (basename === fileName) {
      out = out.concat(getRoutesFromDir(path.join(dir, basename), baseDir));
      return;
    }

    // Infer the route for each valid file.
    const tmp = path.join(dir, basename).replace(baseDir, '').split('/').filter((val) => val);
    const url = tmp
      .map((v, i)  => {
        const t = _.kebabCase(v);
        return ~indexPattern.indexOf(t) && (i === tmp.length - 1) ? '' : t;
      })
      .join('/');

    out.push({
      component: `${path.join(dir, fileName).replace(baseDir, '')}`.split('/').filter((val) => val).join('/'),
      exact: url === '',
      path: `/${url}`,
    });
  });

  return out;
}

export function getLocalesFromDir(dir, defaultLocale, whitelistedLocales) {
  const t = fs
    .readdirSync(dir)
    .filter((val) => !(/(^|\/)\.[^/.]/g).test(val))
    .map((val) => path.basename(val, '.json'))
    .filter((val) => whitelistedLocales ? ~whitelistedLocales.indexOf(val) : true);

  if (defaultLocale && ~t.indexOf(defaultLocale)) {
    t.splice(t.indexOf(defaultLocale), 1);
    t.unshift(defaultLocale);
  }

  return t;
}

export function getTranslationsFromDir(dir, whitelistedLocales) {
  const dict = {};
  const locales = whitelistedLocales ? whitelistedLocales : getLocalesFromDir(dir);
  const t = requireDir(path.resolve(dir));

  for (const locale in t) {
    if (~locales.indexOf(locale)) {
      dict[locale] = t[locale];
    }
  }

  return dict;
}

export function getLocaleDataFromDir(dir, whitelistedLocales) {
  const dict = {};
  const locales = whitelistedLocales ? whitelistedLocales : getLocalesFromDir(dir);
  const t = requireDir(path.resolve(cwd, 'node_modules', 'react-intl/locale-data'));

  for (const locale in t) {
    if (~locales.indexOf(locale)) {
      dict[locale] = t[locale];
    }
  }

  return dict;
}

export function getLocalizedRoutesFromDir(dir, whitelistedLocales) {
  // Generate routes based on the pages directory.
  const routes = getRoutesFromDir(dir);
  let localizedRoutes = [];

  // Generate localized routes for each supported locale if there are multiple
  // supported locales. Ignore the default locale (first in the array).
  for (let i = 1, locale = whitelistedLocales[i]; i < whitelistedLocales.length; i++) {
    localizedRoutes = localizedRoutes.concat(_.cloneDeep(routes).map((route) => {
      const url = path.join(locale, route.path).split('/').filter((val) => val).join('/');
      route.exact = false;
      route.path = `/${url}`;
      return route;
    }));
  }

  // Merge the base routes and the localized routes.
  const out = routes.concat(localizedRoutes);

  // Finally, add the wildcard route at the end to redirect to 404 page.
  if (fs.existsSync(path.resolve(dir, 'NotFound.jsx'))) {
    out.push({
      component: 'NotFound.jsx',
      exact: false,
      path: '*',
    });
  }

  return out;
}
