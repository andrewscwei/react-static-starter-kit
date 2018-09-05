/**
 * @file Client app root.
 */

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { AppState } from '@/store';
import { changeLocale } from '@/store/intl';
import theme from '@/styles/theme';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Action, bindActionCreators, Dispatch } from 'redux';
import * as styledComponents from 'styled-components';
import normalize from 'styled-normalize';

const { default: styled, __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS: sc, injectGlobal, ThemeProvider } = styledComponents as any;

injectGlobal`
  ${normalize} /* stylelint-disable-line max-empty-lines */

  html,
  body {
    background: ${theme.backgroundColor};
    font-family: 'Roboto', sans-serif;
    height: 100%;
    width: 100%;
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

const StyledRoot = styled.div`
  height: 100%;
  position: absolute;
  width: 100%;
`;

interface StateProps {
  locale: string;
  locales: ReadonlyArray<string>;
  t: TranslationData;
}

interface DispatchProps {
  changeLocale(locale: string): void;
}

interface OwnProps {
  route: RouteComponentProps<any>;
}

export interface Props extends StateProps, DispatchProps, OwnProps {}

export interface State {

}

class App extends PureComponent<Props, State> {
  componentDidMount() {
    if (window.__PRERENDERING__) {
      const styles = sc.StyleSheet.instance.toHTML();
      document.getElementsByTagName('head')[0].innerHTML += styles;
    }
  }

  componentWillMount() {
    this.updateLocale();
  }

  componentDidUpdate() {
    this.updateLocale();
  }

  updateLocale = () => {
    const { route, changeLocale, locales } = this.props;
    const locale = route.location.pathname.split('/')[1];

    if (~locales.indexOf(locale)) {
      changeLocale(locale);
    }
    else {
      changeLocale(locales[0]);
    }
  }

  generateRoutes = () => {
    return __ROUTES_CONFIG__.map((route: RouteData, index: number) => {
      const Component = require(`@/containers/${route.component}`).default;
      return <Route exact={route.exact} path={route.path} component={Component} key={index}/>;
    });
  }

  render() {
    const { locale, route, t } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <StyledRoot>
          <Header/>
          <TransitionGroup>
            <CSSTransition key={route.location.key} timeout={300} classNames='fade'>
              <Switch location={route.location}>{this.generateRoutes()}</Switch>
            </CSSTransition>
          </TransitionGroup>
          <Footer/>
        </StyledRoot>
      </ThemeProvider>
    );
  }
}

export default connect(
  (state: AppState): StateProps => ({
    t: state.intl.translations,
    locale: state.intl.locale,
    locales: state.intl.locales,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
    changeLocale,
  }, dispatch),
)(App);
