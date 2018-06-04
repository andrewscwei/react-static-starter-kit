import { ActionType } from '@/enums';

export interface Action {
  type: ActionType;
}

export interface User {
  [key: string]: any;
}

export interface UsersState {
  users: ReadonlyArray<User>;
}

export interface UsersLoadedAction extends Action {
  users: ReadonlyArray<User>;
}

export interface IntlState {
  locale: string;
  messages: TranslationData;
}

export interface LocaleChangeAction extends Action {
  locale: string;
}

export interface AppState {
  intl: IntlState;
  users: UsersState;
}
