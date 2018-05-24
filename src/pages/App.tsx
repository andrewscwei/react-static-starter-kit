/**
 * @file Client app root.
 */

import '@/pages/App.pcss';
import { PureComponent } from 'react';
import { renderRoutes } from 'react-router-config';

interface Props {
  route;
}

class App extends PureComponent<Props> {
  render() {
    return renderRoutes(this.props.route.routes);
  }
}

export default App;
