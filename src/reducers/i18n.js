import { addLocaleData } from 'react-intl';

for (let i = 0; i < $APP_CONFIG.locales.length; i++) {
  const locale = $APP_CONFIG.locales[i];

  try {
    addLocaleData(require(`react-intl/locale-data/${locale}`));
  }
  catch (err) {
    // eslint-disable-next-line no-console
    console.error(`No locale data fround for "${locale}"`);
  }
}

export const I18N_LOCALE_CHANGED = `@i18n/localeChanged`;

const translations = {};

if (process.env.NODE_ENV === `development`) {
  // Require context for all locale translation files and apply them to i18next
  // so that they can be watched by Webpack.
  const localeReq = require.context(`@/../config/locales`, true, /^.*\.json$/);
  localeReq.keys().forEach((path) => {
    const locale = path.replace(`./`, ``).replace(`.json`, ``);
    if (!~$APP_CONFIG.locales.indexOf(locale)) return;
    translations[locale] = localeReq(path);
  });
}
else {
  for (const locale in $TRANSLATIONS) {
    translations[locale] = $TRANSLATIONS[locale];
  }
}

const initialState = {
  locale: $APP_CONFIG.locales[0],
  messages: translations[$APP_CONFIG.locales[0]]
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case I18N_LOCALE_CHANGED:
    return Object.assign({}, state, { locale: action.locale, messages: translations[action.locale] });
  default:
    return state;
  }
}

export function changeLocale(locale) {
  return function(dispatch) {
    dispatch({
      type: I18N_LOCALE_CHANGED,
      locale: locale
    });
  };
}
