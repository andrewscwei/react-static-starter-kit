import { addLocaleData } from 'react-intl';

const IntlActionType = {
  LOCALE_CHANGED: 'localeChanged',
};

let defaultLocale;
let locales;
let translations = {};

if (process.env.NODE_ENV === 'development') {
  // Require context for all locale translation files and apply them to i18next
  // so that they can be watched by Webpack.
  const localeReq = require.context('../../config/locales', true, /^.*\.json$/);
  localeReq.keys().forEach(path => {
    const locale = path.replace('./', '').replace('.json', '');
    if (!~__APP_CONFIG__.locales.indexOf(locale)) { return; }
    translations[locale] = localeReq(path);
  });

  defaultLocale = __APP_CONFIG__.locales[0];
  locales = __APP_CONFIG__.locales;
}
else {
  defaultLocale = __INTL_CONFIG__.defaultLocale;
  locales = __INTL_CONFIG__.locales;
  translations = __INTL_CONFIG__.dict;
}

for (const locale of __APP_CONFIG__.locales) {
  addLocaleData(__INTL_CONFIG__.localeData[locale]);
}

const initialState = {
  locale: defaultLocale,
  locales,
  translations: translations[defaultLocale],
};

export function changeLocale(locale) {
  return {
    locale,
    type: IntlActionType.LOCALE_CHANGED,
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case IntlActionType.LOCALE_CHANGED:
    return { ...state, locale: action.locale, translations: translations[action.locale] };
  default:
    return state;
  }
}
