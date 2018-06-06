declare const __APP_CONFIG__: { [key: string]: any };
declare const __INTL_CONFIG__: {
  defaultLocale: string;
  localeData: Readonly<LocaleDataDict>;
  locales: ReadonlyArray<string>;
  dict: Readonly<TranslationDataDict>;
};
declare const __ROUTES_CONFIG__: RouteData[];

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
