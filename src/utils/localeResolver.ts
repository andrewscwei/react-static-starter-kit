export default function localeResolver(locale: string, reverse: boolean = false): string {
  const defaultLocale = __INTL_CONFIG__.defaultLocale;
  const supportedLocales = __INTL_CONFIG__.locales;

  if (reverse) {
    switch (locale) {
    case 'ja-jp': return 'ja';
    default: return 'en';
    }
  }
  else {
    if (supportedLocales.indexOf(locale) < 0) return defaultLocale;

    switch (locale) {
    case 'ja': return 'ja-jp';
    default: return 'en-us';
    }
  }
}
