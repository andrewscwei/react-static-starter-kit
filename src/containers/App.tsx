/**
 * @file Client app root.
 */

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { changeLocale } from '@/store/intl';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { bindActionCreators } from 'redux';
import styled, { injectGlobal } from 'styled-components';
import normalize from 'styled-normalize';

interface Props {
  locale: string;
  route: RouteComponentProps<any>;
  t: TranslationData;
  changeLocale(locale: string): void;
}

const StyledRoot = styled.div`
  height: 100%;
  width: 100%;
`;

const mapStateToProps = (state: any): Partial<Props> => ({ t: state.intl.translations, locale: state.intl.locale });
const mapDispatchToProps = (dispatch: any): Partial<Props> => bindActionCreators({ changeLocale }, dispatch);

class App extends PureComponent<Props> {
  generateRoutes = () => {
    return $ROUTES_CONFIG.map((route: RouteData, index: number) => {
      const Component = require(`@/containers/${route.component}`).default;
      return <Route exact={route.exact} path={route.path} component={Component} key={index}/>;
    });
  }

  updateLocale = () => {
    const { route, changeLocale } = this.props;
    const locales = $LOCALE_CONFIG.locales;
    const locale = route.location.pathname.split('/')[1];

    if (locales.includes(locale)) {
      changeLocale(locale);
    }
    else {
      changeLocale(locales[0]);
    }
  }

  componentWillMount() {
    this.updateLocale();
  }

  componentDidUpdate() {
    this.updateLocale();
  }

  render() {
    const { t, locale, route } = this.props;

    return (
      <StyledRoot>
        <Header t={t} locale={locale}/>
        <TransitionGroup>
          <CSSTransition key={route.location.key} timeout={300} classNames='fade'>
            <Switch location={route.location}>{this.generateRoutes()}</Switch>
          </CSSTransition>
        </TransitionGroup>
        <Footer t={t}/>
      </StyledRoot>
    );
  }
}

export default connect<{}, {}, Partial<Props>>(mapStateToProps, mapDispatchToProps)(App);

injectGlobal`
  ${normalize}

  html,
  body {
    background: #111;
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
