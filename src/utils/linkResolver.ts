import { Document } from 'prismic-javascript/d.ts/documents';
import localeResolver from './localeResolver';

export default function linkResolver(doc: Document): string {
  const locale = doc.lang ? localeResolver(doc.lang, true) : 'en';

  switch (doc.type) {
  case 'home':
    if (locale === __INTL_CONFIG__.defaultLocale) return '/';
    return `/${locale}`;
  case 'about':
    if (locale === __INTL_CONFIG__.defaultLocale) return '/about';
    return `/${locale}/about`;
  default: return '/404';
  }
}
