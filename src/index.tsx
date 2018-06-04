/**
 * @file Entry file.
 */

import App from '@/App';
import * as reducers from '@/store';
import theme from '@/styles/theme';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { connect, Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { render } from 'react-snapshot';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { ThemeProvider } from 'styled-components';

const ConnectedIntlProvider = connect((state: any) => ({
  key: state.i18n.locale,
  locale: state.i18n.locale,
  messages: state.i18n.messages,
}))(IntlProvider);

const store = createStore(combineReducers(reducers), {}, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <ConnectedIntlProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Route render={({ location }) => (
            <App location={location}/>
          )}/>
        </Router>
      </ThemeProvider>
    </ConnectedIntlProvider>
  </Provider>,
  document.getElementById(`app`),
);
