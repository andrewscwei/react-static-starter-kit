/**
 * @file Client app root.
 */

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { changeLocale } from '@/store/intl';
import globalStyles from '@/styles/global';
import theme from '@/styles/theme';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { bindActionCreators } from 'redux';
import * as styledComponents from 'styled-components';

const { default: styled, __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS: sc, injectGlobal, ThemeProvider } = styledComponents;

class App extends PureComponent {
  static propTypes = {
    locales: PropTypes.array.isRequired,
    changeLocale: PropTypes.func.isRequired,
    route: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.updateLocale();
  }

  componentDidMount() {
    if (window.__PRERENDERING__) {
      const styles = sc.StyleSheet.instance.toHTML();
      document.getElementsByTagName('head')[0].innerHTML += styles;
    }
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
    return __ROUTES_CONFIG__.map((route, index) => {
      const Component = require(`@/containers/${route.component}`).default;
      return <Route exact={route.exact} path={route.path} component={Component} key={index}/>;
    });
  }

  render() {
    const { route } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <StyledRoot>
          <Header/>
          <StyledBody>
            <CSSTransition key={route.location.key} timeout={300} classNames='fade'>
              <Switch location={route.location}>{this.generateRoutes()}</Switch>
            </CSSTransition>
          </StyledBody>
          <Footer/>
        </StyledRoot>
      </ThemeProvider>
    );
  }
}

export default connect(
  (state) => ({
    locales: state.intl.locales,
  }),
  (dispatch) => bindActionCreators({
    changeLocale,
  }, dispatch),
)(App);

injectGlobal`
  ${globalStyles}
`;

const StyledRoot = styled.div`
  height: 100%;
  position: absolute;
  width: 100%;
`;

const StyledBody = styled(TransitionGroup)`
  height: 100%;
  position: absolute;
  width: 100%;
`;
