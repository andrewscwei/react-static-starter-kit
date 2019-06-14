import _ from 'lodash';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/d.ts/documents';
import { Action, Dispatch } from 'redux';
import localeResolver from '../utils/localeResolver';

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

export function fetchDocsByType(type: string, locale: string = __APP_CONFIG__.locales[0]) {
  return async (dispatch: Dispatch<PrismicAction>) => {
    const { apiEndpoint, accessToken } = __APP_CONFIG__.prismic;
    const api = await Prismic.api(apiEndpoint, { accessToken });

    let ref;

    try {
      ref = window.__PRISMIC_REF__ || api.master();
    }
    catch (err) {
      ref = api.master();
    }

    const res = await api.query(Prismic.Predicates.at('document.type', type), { ref, lang: localeResolver(locale) });
    const docs = res.results;

    debug(`Fetching doc from Prismic for type "${type}" and locale "${locale}"...`, 'OK', docs);

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
