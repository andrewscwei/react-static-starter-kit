/**
 * @file Route definitions for React router.
 */

import Blog from '../containers/Blog';
import BlogPost from '../containers/BlogPost';
import Home from '../containers/Home';
import NotFound from '../containers/NotFound';
import Preview from '../containers/Preview';

export default [{
  path: '/',
  exact: true,
  component: Home,
}, {
  path: '/blog',
  exact: true,
  component: Blog,
}, {
  path: '/blog/:uid',
  component: BlogPost,
}, {
  path: '/preview',
  exact: true,
  component: Preview,
}, {
  path: '/ja',
  exact: true,
  component: Home,
}, {
  path: '/ja/blog',
  exact: true,
  component: Blog,
}, {
  path: '/ja/blog/:uid',
  component: BlogPost,
}, {
  path: '*',
  component: NotFound,
}];
