declare const __APP_CONFIG__: { [key: string]: any };

declare const __INTL_CONFIG__: {
  defaultLocale: string;
  localeData: Readonly<LocaleDataDict>;
  locales: ReadonlyArray<string>;
  dict: Readonly<TranslationDataDict>;
};

declare const __ROUTES_CONFIG__: Array<RouteData>;

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}

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

interface Window {
  __INITIAL_STATE__: any;
  __PRISMIC_REF__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  prismic: { endpoint: any; };
  snapSaveState: () => {};
}
