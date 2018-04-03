/**
 * @file Entry file.
 */

import * as reducers from '@/reducers';
import routes from './routes';
import thunk from 'redux-thunk';
import React from 'react';
import Router from 'react-router-dom/BrowserRouter';
import { connect } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { render } from 'react-snapshot';
import { renderRoutes } from 'react-router-config';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

const ConnectedIntlProvider = connect((state) => ({ locale: state.i18n.locale, key: state.i18n.locale, messages: state.i18n.messages }))(IntlProvider);
const store = createStore(combineReducers(reducers), {}, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <ConnectedIntlProvider>
      <Router>
        {renderRoutes(routes)}
      </Router>
    </ConnectedIntlProvider>
  </Provider>,
  document.getElementById(`app`)
);
