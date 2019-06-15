import _ from 'lodash';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/d.ts/documents';
import { Action, Dispatch } from 'redux';
import localeResolver from '../utils/localeResolver';
import { getAPI, loadPreviewToken } from '../utils/prismic';

const debug = require('debug')('app:prismic');

export enum PrismicActionType {
  DOC_LOADED = 'doc-loaded',
}

export interface PrismicState {
  docs: {
    [type: string]: {
      [locale: string]: ReadonlyArray<Document>;
    };
  };
}

export interface PrismicAction extends Action<PrismicActionType> {
  payload: { [key: string]: any };
}

const initialState: PrismicState = {
  docs: {},
};

export default function reducer(state = initialState, action: PrismicAction): PrismicState {
  switch (action.type) {
  case PrismicActionType.DOC_LOADED:
    const newState: PrismicState = _.cloneDeep(state);
    const { type, locale, docs } = action.payload;

    if (!newState.docs[type]) newState.docs[type] = {};
    newState.docs[type][locale] = docs;

    return newState;
  default:
    return state;
  }
}

export function fetchDocsByType(type: string, locale: string = __APP_CONFIG__.locales[0], ref?: string) {
  return async (dispatch: Dispatch<PrismicAction>) => {
    const api = await getAPI();
    const res = await api.query(Prismic.Predicates.at('document.type', type), { ref: ref || api.master(), lang: localeResolver(locale) });
    const docs = res.results;

    debug(`Fetching docs from Prismic for type "${type}" and locale "${locale}"...`, 'OK', docs);

    dispatch({
      type: PrismicActionType.DOC_LOADED,
      payload: {
        type,
        locale,
        docs,
      },
    });
  };
}
