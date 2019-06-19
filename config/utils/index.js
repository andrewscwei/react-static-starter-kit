/**
 * @file Utility functions for the build process.
 */

import fs from 'fs';
import path from 'path';
import requireDir from 'require-dir';

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
