import { ActionType } from '@/enums';
import { Action, Translations } from '@/types';
import { addLocaleData } from 'react-intl';

for (const locale of $APP_CONFIG.locales) {
  addLocaleData($LOCALE_CONFIG.localeData[locale]);
}

const translations: { [_: string]: Translations} = {};

if (process.env.NODE_ENV === `development`) {
  // Require context for all locale translation files and apply them to i18next
  // so that they can be watched by Webpack.
  const localeReq = require.context(`@/../config/locales`, true, /^.*\.json$/);
  localeReq.keys().forEach(path => {
    const locale = path.replace(`./`, ``).replace(`.json`, ``);
    if (!~$APP_CONFIG.locales.indexOf(locale)) { return; }
    translations[locale] = localeReq(path) as Translations;
  });
}
else {
  for (const locale in $LOCALE_CONFIG.translations) {
    if (!$LOCALE_CONFIG.translations.hasOwnProperty(locale)) continue;
    translations[locale] = $LOCALE_CONFIG.translations[locale] as Translations;
  }
}

const initialState: State = {
  locale: $APP_CONFIG.locales[0],
  messages: translations[$APP_CONFIG.locales[0]],
};

export interface State {
  locale: string;
  messages: Translations;
}

export interface LocaleChangeAction extends Action {
  locale: string;
}

export function changeLocale(locale: string): LocaleChangeAction {
  return {
    locale,
    type: ActionType.LOCALE_CHANGED,
  };
}

export default function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
  case ActionType.LOCALE_CHANGED:
    const t = action as LocaleChangeAction;

    return { ...state, locale: t.locale, messages: translations[t.locale] };
  default:
    return state;
  }
}
