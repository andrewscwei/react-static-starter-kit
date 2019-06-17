import _ from 'lodash';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/d.ts/documents';
import { QueryOptions } from 'prismic-javascript/d.ts/ResolvedApi';
import { Action, Dispatch } from 'redux';
import { getAPI, localeResolver } from '../utils/prismic';

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
    const { type, locale, docs: newDocs } = action.payload;

    if (!newState.docs[type]) newState.docs[type] = {};
    if (!newState.docs[type][locale]) newState.docs[type][locale] = [];

    const oldDocs = newState.docs[type][locale];
    const mergedDocs = _.unionWith([...newDocs, ...oldDocs], (doc1, doc2) => (doc1.id === doc2.id));

    newState.docs[type][locale] = mergedDocs;

    return newState;
  default:
    return state;
  }
}

export function fetchDocByTypeUID(type: string, uid: string, options: Partial<QueryOptions> = {}) {
  return async (dispatch: Dispatch<PrismicAction>) => {
    const api = await getAPI();
    const opts = {
      ref: api.master(),
      lang: localeResolver(__INTL_CONFIG__.defaultLocale),
      ...options,
    };

    const res = await api.query(Prismic.Predicates.at(`my.${type}.uid`, uid), opts);
    const docs = res.results;

    debug(`Fetching docs from Prismic for UID "${uid}" and language "${opts.lang}"...`, 'OK', docs);

    dispatch({
      type: PrismicActionType.DOC_LOADED,
      payload: {
        type,
        locale: localeResolver(opts.lang, true),
        docs,
      },
    });
  };
}

export function fetchDocsByType(type: string, options: Partial<QueryOptions> = {}) {
  return async (dispatch: Dispatch<PrismicAction>) => {
    const api = await getAPI();
    const opts = {
      lang: localeResolver(__INTL_CONFIG__.defaultLocale),
      ref: api.master(),
      orderings : '[document.first_publication_date desc]',
      ...options,
    };

    const res = await api.query(Prismic.Predicates.at('document.type', type), opts);
    const docs = res.results;

    debug(`Fetching docs from Prismic for type "${type}" and language "${opts.lang}"...`, 'OK', docs);

    dispatch({
      type: PrismicActionType.DOC_LOADED,
      payload: {
        type,
        locale: localeResolver(opts.lang, true),
        docs,
      },
    });
  };
}
