/**
 * @file Client app root.
 */

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { changeLocale } from '@/store/i18n';
import { Translations } from '@/types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { bindActionCreators } from 'redux';
import styled, { injectGlobal } from 'styled-components';
import normalize from 'styled-normalize';

interface Props {
  t: Translations;
  changeLocale: (locale: string) => void;
}

const StyledRoot = styled.div`
  height: 100%;
  width: 100%;
`;

const mapStateToProps = (state): Partial<Props> => ({ t: state.i18n.messages });
const mapDispatchToProps = (dispatch): Partial<Props> => bindActionCreators({ changeLocale }, dispatch);
class App extends PureComponent<Props> {
  generateRoutes = () => {
    return $ROUTES_CONFIG.map((route, index) => {
      const { path, component } = route;
      const Component = require(`@/pages/${component}`).default;
      return <Route exact={true} path={path} component={Component} key={index}/>;
    });
  }

  render() {
    const { t, changeLocale } = this.props;

    return (
      <Router>
        <Route render={({ location }) => (
          <StyledRoot>
            <Header t={t}/>
            <TransitionGroup>
              <CSSTransition key={location.key} timeout={300} classNames='fade'>
                <Switch location={location}>{this.generateRoutes()}</Switch>
              </CSSTransition>
            </TransitionGroup>
            <Footer t={t} changeLocale={changeLocale}/>
          </StyledRoot>
        )}/>
      </Router>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

injectGlobal`
  ${normalize}

  html,
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
