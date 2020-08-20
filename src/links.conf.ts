import { Document } from 'prismic-javascript/types/documents';

export default function(doc: Document) {
  switch (doc.type) {
  case 'home': return '/';
  case 'blog_post': return `/blog/${doc.uid}`;
  default: return '/';
  }
}
