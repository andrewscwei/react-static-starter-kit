/* tslint:disable no-reference */
///<reference path='../../src/custom.d.ts' />
/**
 * @file Utility functions for the build process.
 */

import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import requireDir from 'require-dir';

const cwd = path.join(__dirname, '../../');

export function getRoutesFromDir(dir: string, baseDir: string = dir): Array<RouteData> {
  const pages: Array<string> = fs.readdirSync(dir);
  let out: Array<RouteData> = [];

  pages.forEach((fileName: string) => {
    if ((/(^|\/)\.[^/.]/g).test(fileName)) return;

    const basename = path.basename(fileName, '.tsx');
    const ignorePattern = ['404', 'NotFound', 'Root', 'App'];
    const indexPattern = ['index', 'home'];

    // Ignore files with certain names (i.e. NotFound.tsx). No need to generate a
    // route for these files.
    if (~ignorePattern.indexOf(basename)) return;

    // Check if directory. If it is, crawl its contents to determine sub-routes.
    if (basename === fileName) {
      out = out.concat(getRoutesFromDir(path.join(dir, basename), baseDir));
      return;
    }

    // Infer the route for each valid file.
    const tmp: Array<string> = path.join(dir, basename).replace(baseDir, '').split('/').filter((val: string) => val);
    const url: string = tmp
      .map((v, i)  => {
        const t = _.kebabCase(v);
        return ~indexPattern.indexOf(t) && (i === tmp.length - 1) ? '' : t;
      })
      .join('/');

    out.push({
      component: `${path.join(dir, fileName).replace(baseDir, '')}`.split('/').filter((val: string) => val).join('/'),
      exact: url === '',
      path: `/${url}`,
    });
  });

  return out;
}

export function getLocalesFromDir(dir: string, defaultLocale?: string, whitelistedLocales?: Array<string>): Array<string> {
  const t = fs
    .readdirSync(dir)
    .filter((val: string) => !(/(^|\/)\.[^/.]/g).test(val))
    .map((val: string) => path.basename(val, '.json'))
    .filter((val: string) => whitelistedLocales ? ~whitelistedLocales.indexOf(val) : true);

  if (defaultLocale && ~t.indexOf(defaultLocale)) {
    t.splice(t.indexOf(defaultLocale), 1);
    t.unshift(defaultLocale);
  }

  return t;
}

export function getTranslationsFromDir(dir: string, whitelistedLocales?: Array<string>): TranslationDataDict {
  const dict: TranslationDataDict = {};
  const locales = whitelistedLocales ? whitelistedLocales : getLocalesFromDir(dir);
  const t: { [key: string]: any } = requireDir(path.resolve(dir));

  for (const locale in t) {
    if (~locales.indexOf(locale)) {
      dict[locale] = t[locale];
    }
  }

  return dict;
}

export function getLocaleDataFromDir(dir: string, whitelistedLocales?: Array<string>): LocaleDataDict {
  const dict: LocaleDataDict = {};
  const locales = whitelistedLocales ? whitelistedLocales : getLocalesFromDir(dir);
  const t: { [key: string]: any } = requireDir(path.resolve(cwd, 'node_modules', 'react-intl/locale-data'));

  for (const locale in t) {
    if (~locales.indexOf(locale)) {
      dict[locale] = t[locale];
    }
  }

  return dict;
}

export function getLocalizedRoutesFromDir(dir: string, whitelistedLocales: Array<string>): Array<RouteData> {
  // Generate routes based on the pages directory.
  const routes = getRoutesFromDir(dir);
  let localizedRoutes: Array<RouteData> = [];

  // Generate localized routes for each supported locale if there are multiple
  // supported locales. Ignore the default locale (first in the array).
  for (let i = 1, locale = whitelistedLocales[i]; i < whitelistedLocales.length; i++) {
    localizedRoutes = localizedRoutes.concat(_.cloneDeep(routes).map((route: RouteData) => {
      const url = path.join(locale, route.path).split('/').filter((val: string) => val).join('/');
      route.exact = false;
      route.path = `/${url}`;
      return route;
    }));
  }

  // Merge the base routes and the localized routes.
  const out = routes.concat(localizedRoutes);

  // Finally, add the wildcard route at the end to redirect to 404 page.
  if (fs.existsSync(path.resolve(dir, 'NotFound.tsx'))) {
    out.push({
      component: 'NotFound.tsx',
      exact: false,
      path: '*',
    });
  }

  return out;
}
