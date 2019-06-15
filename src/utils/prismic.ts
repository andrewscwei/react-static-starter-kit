import cookie from 'cookie';
import Prismic from 'prismic-javascript';
import ResolvedApi from 'prismic-javascript/d.ts/ResolvedApi';
import linkResolver from './linkResolver';

const debug = require('debug')('app:prismic');

export function getAPI(): Promise<ResolvedApi> {
  const { apiEndpoint, accessToken } = __APP_CONFIG__.prismic;
  return Prismic.api(apiEndpoint, { accessToken });
}

export async function getPreviewPath(token: string): Promise<string> {
  const api = await getAPI();
  return api.previewSession(token, linkResolver, '/');
}

export function savePreviewToken(token: string) {
  document.cookie = cookie.serialize(Prismic.previewCookie, token, {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    path: '/',
  });

  if (cookie.parse(document.cookie)[Prismic.previewCookie]) {
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
