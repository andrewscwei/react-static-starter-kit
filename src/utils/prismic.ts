import cookie from 'cookie';
import _ from 'lodash';
import PrismicDOM from 'prismic-dom';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/d.ts/documents';
import ResolvedApi from 'prismic-javascript/d.ts/ResolvedApi';
import { getLocalizedPath } from './i18n';

const debug = process.env.NODE_ENV === 'development' ? require('debug')('app:prismic') : () => {};

export function linkResolver(doc: Document): string {
  const locale = doc.lang ? localeResolver(doc.lang, true) : 'en';

  switch (doc.type) {
  case 'home': return getLocalizedPath('/', locale);
  case 'blog_post': return getLocalizedPath(`/blog/${doc.uid}`, locale);
  default: return '/';
  }
}

export function localeResolver(locale: string, reverse: boolean = false): string {
  const defaultLocale = __I18N_CONFIG__.defaultLocale;
  const supportedLocales = __I18N_CONFIG__.locales;

  if (reverse) {
    switch (locale) {
    case 'ja-jp': return 'ja';
    default: return 'en';
    }
  }
  else {
    if (supportedLocales.indexOf(locale) < 0) return defaultLocale;

    switch (locale) {
    case 'ja': return 'ja-jp';
    default: return 'en-us';
    }
  }
}

export function getAPI(): Promise<ResolvedApi> {
  const { apiEndpoint, accessToken } = __APP_CONFIG__.prismic;
  return Prismic.api(apiEndpoint, { accessToken });
}

export async function getPreviewPath(token: string, documentId: string): Promise<string> {
  const api = await getAPI();
  return api.getPreviewResolver(token, documentId).resolve(linkResolver, '/');
}

export function savePreviewToken(token: string) {
  document.cookie = cookie.serialize(Prismic.previewCookie, token, {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    path: '/',
  });

  if (loadPreviewToken()) {
    debug('Saving preview token to cookies...', 'OK');
  }
  else {
    debug('Saving preview token to cookies...', 'ERR');
  }
}

export function loadPreviewToken(): string | undefined {
  const token = cookie.parse(document.cookie)[Prismic.previewCookie];
  return token;
}

export function getText(doc?: Document, path: string = ''): string | undefined {
  const fragment = _.get(doc, path);

  if (!fragment) return undefined;
  if (typeof fragment === 'string') return fragment;

  return PrismicDOM.RichText.asText(fragment);
}

export function getTexts(doc?: Document, path: string = '', subpath: string = ''): ReadonlyArray<string> | undefined {
  const fragments = _.get(doc, path);

  if (!_.isArray(fragments)) return undefined;

  const texts = _.reduce(fragments, (out, curr: any) => {
    const text = _.get(curr, subpath);
    if (!text) return out;

    if (typeof text === 'string') {
      out.push(text);
    }
    else {
      out.push(PrismicDOM.RichText.asText(text));
    }

    return out;
  }, Array<string>());

  return texts;
}

export function getUrl(doc?: Document, path: string = ''): string | undefined {
  const fragment = _.get(doc, path);

  if (!fragment) return undefined;

  return PrismicDOM.Link.url(fragment, linkResolver);
}

export function getUrls(doc?: Document, path: string = '', subpath: string = ''): ReadonlyArray<string> | undefined {
  const fragments = _.get(doc, path);

  if (!_.isArray(fragments)) return undefined;

  const urls = _.reduce(fragments, (out, curr: any) => {
    const url = _.get(curr, subpath);
    if (!url) return out;
    if (url.length === 0) return out;

    out.push(PrismicDOM.Link.url(url, linkResolver));

    return out;
  }, Array<string>());

  return urls;
}

export function getMarkup(doc?: Document, path: string = ''): string | undefined {
  const fragment = _.get(doc, path);

  if (!fragment) return undefined;

  return PrismicDOM.RichText.asHtml(fragment, linkResolver);
}

export function getMarkups(doc?: Document, path: string = '', subpath: string = ''): ReadonlyArray<string> | undefined {
  const fragments = _.get(doc, path);

  if (!_.isArray(fragments)) return undefined;

  const markups = _.reduce(fragments, (out, curr: any) => {
    const markup = _.get(curr, subpath);
    if (!markup) return out;
    if (markup.length === 0) return out;

    out.push(PrismicDOM.RichText.asHtml(markup, linkResolver));

    return out;
  }, Array<string>());

  return markups;
}

export function getDoc(doc?: Document, path: string = '', lookupDocs?: ReadonlyArray<Document>): Document | undefined {
  const fragment = _.get(doc, path);

  if (!fragment) return undefined;
  if (!fragment.id) return undefined;

  if (!lookupDocs) return fragment;

  return _.find(lookupDocs, (v) => v.id === fragment.id);
}

export function getDocs(doc?: Document, path: string = '', subpath: string = '', lookupDocs?: ReadonlyArray<Document>): ReadonlyArray<Document> | undefined {
  const fragments = _.get(doc, path);

  if (!fragments) return undefined;

  const docs = _.reduce(fragments, (out, curr: any) => {
    const doc = _.get(curr, subpath);
    if (doc && doc.id) out.push(doc);
    return out;
  }, Array<Document>());

  if (!lookupDocs) return docs;

  const matchedDocs = _.intersectionWith(lookupDocs, docs, (lookupDoc, doc) => lookupDoc.id === doc.id);

  return matchedDocs;
}
