declare const $APP_CONFIG: any;
declare const $LOCALE_CONFIG: any;
declare const $ROUTES_CONFIG: any;

declare module 'react-snapshot';

interface TranslationData {
  [key: string]: string;
}

interface TranslationDataDict {
  [locale: string]: TranslationData;
}

interface LocaleDataDict {
  [locale: string]: ReactIntl.LocaleData;
}

interface RouteData {
  component: string;
  exact?: boolean;
  path: string;
}
