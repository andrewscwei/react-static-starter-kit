/**
 * @file Route definitions for React router.
 */

import App from '@/pages/App';
import About from '@/pages/About';
import Home from '@/pages/Home';
import List from '@/pages/List';
import NotFound from '@/pages/NotFound';

export default [{
  component: App,
  routes: [{
    path: `/`,
    exact: true,
    component: Home
  }, {
    path: `/about/`,
    component: About
  }, {
    path: `/list/`,
    component: List
  }, {
    path: `*`,
    component: NotFound
  }]
}];
