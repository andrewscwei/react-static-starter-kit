/**
 * @file Client app root.
 */

import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { injectGlobal } from 'styled-components';
import normalize from 'styled-normalize';

class App extends PureComponent {
  generateRoutes = () => {
    return $ROUTES_CONFIG.map((route, index) => {
      const { path, component } = route;
      const Component = require(`@/pages/${component}`).default;
      return <Route path={path} component={Component} key={index}/>;
    });
  }

  render() {
    return (
      <Router>
        <Route render={({ location }) => (
          <TransitionGroup>
            <CSSTransition key={location.key} timeout={300} classNames='fade'>
              <Switch location={location}>{this.generateRoutes()}</Switch>
            </CSSTransition>
          </TransitionGroup>
        )}/>
      </Router>
    );
  }
}

export default App;

injectGlobal`
  ${normalize}

  body {
    width: 100%;
    height: 100%;
    background: #111;
  }

  .fade-enter {
    opacity: 0;
  }

  .fade-enter.fade-enter-active {
    opacity: 1;
    transition: all .3s;
  }

  .fade-exit {
    opacity: 1;
  }

  .fade-exit.fade-exit-active {
    opacity: 0;
    transition: all .3s;
  }
`;
