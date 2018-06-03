import fs from 'fs';
import _ from 'lodash';
import path from 'path';

export function parseRoutesFromDir(dir: string, baseDir: string = dir) {
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
      out = out.concat(parseRoutesFromDir(path.join(dir, basename), baseDir));
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

export function parseLocalesFromDir(dir: string, whitelistedLocales?: Array<string>) {
  return fs
    .readdirSync(dir)
    .filter((v) => !(/(^|\/)\.[^/.]/g).test(v))
    .map((val) => path.basename(val, `.json`))
    .filter((v) => whitelistedLocales ? ~whitelistedLocales.indexOf(v) : true);
}

export function getTranslationsFromDir(dir: string, whitelistedLocales?: Array<string>) {
  const locales = parseLocalesFromDir(dir, whitelistedLocales);

  return locales.reduce((obj, val) => {
    obj[val] = require(path.join(dir, `${val}.json`));
    return obj;
  }, {});
}

export function getLocaleDataFromDir(dir: string, whitelistedLocales?: Array<string>) {
  const locales = parseLocalesFromDir(dir, whitelistedLocales);

  return locales.reduce((obj, val) => {
    try {
      obj[val] = require(`react-intl/locale-data/${val}`);
    }
    catch (err) {}
    return obj;
  }, {});
}
