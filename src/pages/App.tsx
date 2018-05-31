/**
 * @file Client app root.
 */

import { PureComponent } from 'react';
import { renderRoutes } from 'react-router-config';
import { injectGlobal } from 'styled-components';
import normalize from 'styled-normalize';

interface Props {
  route;
}

class App extends PureComponent<Props> {
  render() {
    return renderRoutes(this.props.route.routes);
  }
}

export default App;

injectGlobal`
  ${normalize}

  body {
    width: 100%;
    height: 100%;
    font-family: 'Roboto', sans-serif;
    background: #111;
  }
`;
