import fs from 'fs';
import _ from 'lodash';
import path from 'path';

export function getRoutesFromDir(dir: string, baseDir: string = dir) {
  const pages = fs.readdirSync(dir);

  let out = [];

  pages.forEach((fileName) => {
    if ((/(^|\/)\.[^/.]/g).test(fileName)) return;

    const basename = path.basename(fileName, `.tsx`);
    const ignorePattern = [`NotFound`];
    const indexPattern = [`index`, `home`];

    // Ignore files with certain names (i.e. NotFound.tsx). No need to generate a
    // route for these files.
    if (~ignorePattern.indexOf(basename)) return;

    // Check if directory. If it is, crawl its contents to determine sub-routes.
    if (basename === fileName) {
      out = out.concat(getRoutesFromDir(path.join(dir, basename), baseDir));
      return;
    }

    // Infer the route for each valid file.
    const tmp: Array<string> = path.join(dir, basename).replace(baseDir, ``).split(`/`).filter((v) => v);
    const url: string = tmp
      .map((v, i)  => {
        const out = _.kebabCase(v);
        return ~indexPattern.indexOf(out) && (i === tmp.length - 1) ? `` : out;
      })
      .join(`/`);

    out.push({
      component: `${path.join(dir, fileName).replace(baseDir, ``)}`.split(`/`).filter((v) => v).join(`/`),
      path: `/${url}`,
    });
  });

  return out;
}

export function getLocalesFromDir(dir: string, defaultLocale?: string, whitelistedLocales?: Array<string>) {
  const t = fs
    .readdirSync(dir)
    .filter((v) => !(/(^|\/)\.[^/.]/g).test(v))
    .map((val) => path.basename(val, `.json`))
    .filter((v) => whitelistedLocales ? ~whitelistedLocales.indexOf(v) : true);

  if (defaultLocale && ~t.indexOf(defaultLocale)) {
    t.splice(t.indexOf(defaultLocale), 1);
    t.unshift(defaultLocale);
  }

  return t;
}

export function getTranslationsFromDir(dir: string, whitelistedLocales?: Array<string>) {
  const locales = whitelistedLocales
    ? whitelistedLocales
    : getLocalesFromDir(dir);

  return locales.reduce((obj, val) => {
    obj[val] = require(path.join(dir, `${val}.json`));
    return obj;
  }, {});
}

export function getLocaleDataFromDir(dir: string, whitelistedLocales?: Array<string>) {
  const locales = whitelistedLocales
    ? whitelistedLocales
    : getLocalesFromDir(dir);

  return locales.reduce((obj, val) => {
    try {
      obj[val] = require(`react-intl/locale-data/${val}`);
    }
    catch (err) {}
    return obj;
  }, {});
}

export function getLocalizedRoutesFromDir(dir: string, whitelistedLocales: Array<string>) {
  // Generate routes based on the pages directory.
  const routes = getRoutesFromDir(dir);
  const localizedRoutes = [];

  // Generate localized routes for each supported locale if there are multiple
  // supported locales. Ignore the default locale (first in the array).
  for (let i = 1, locale = whitelistedLocales[i]; i < whitelistedLocales.length; i++) {
    localizedRoutes.push(_.cloneDeep(routes).map((route) => {
      route.path = `/${path.join(locale, route.path).split(`/`).filter((v) => v).join(`/`)}`;
      return route;
    }));
  }

  // Merge the base routes and the localized routes.
  const out = _.flatten(routes.concat(localizedRoutes));

  // Finally, add the wildcard route at the end to redirect to 404 page.
  if (fs.existsSync(path.resolve(dir, `NotFound.tsx`))) {
    out.push({
      component: `NotFound.jsx`,
      path: `*`,
    });
  }

  return out;
}
