/**
 * @file Route definitions for React router.
 */

import About from '@/pages/About';
import App from '@/pages/App';
import Home from '@/pages/Home';
import List from '@/pages/List';
import NotFound from '@/pages/NotFound';

export default [{
  component: App,
  routes: [{
    component: Home,
    exact: true,
    path: `/`
  }, {
    component: About,
    path: `/about/`
  }, {
    component: List,
    path: `/list/`
  }, {
    component: NotFound,
    path: `*`
  }]
}];
