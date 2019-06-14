export default function localeResolver(locale: string): string {
  if (__APP_CONFIG__.locales.indexOf(locale) < 0) return localeResolver(__APP_CONFIG__.locales[0]);

  switch (locale) {
  case 'ja': return 'ja-jp';
  default: return 'en-us';
  }
}
