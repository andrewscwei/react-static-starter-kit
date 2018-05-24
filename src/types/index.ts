import { ActionType } from '@/enums';

export interface Action {
  type: ActionType;
}

export interface Translations {
  [key: string]: string;
}
