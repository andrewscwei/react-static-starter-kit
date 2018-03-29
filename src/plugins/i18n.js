import i18next from 'i18next';

// Set up i18n.
const i18n = i18next.init({
  ns: [`common`],
  defaultNS: `common`,
  lng: $APP_CONFIG.locales[0],
  react: { wait: true },
  interpolation: { escapeValue: false },
});

if (process.env.NODE_ENV === `development`) {
  // Require context for all locale translation files and apply them to i18next
  // so that they can be watched by Webpack.
  const localeReq = require.context(`@/../config/locales`, true, /^.*\.json$/);
  localeReq.keys().forEach((path) => {
    const locale = path.replace(`./`, ``).replace(`.json`, ``);
    if (!~$APP_CONFIG.locales.indexOf(locale)) return;
    i18n.addResourceBundle(locale, `common`, localeReq(path), true);
  });
}
else {
  for (const locale in $TRANSLATIONS) {
    i18n.addResourceBundle(locale, `common`, $TRANSLATIONS[locale], true);
  }
}

export default i18n;