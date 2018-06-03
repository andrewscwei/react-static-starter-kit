/**
 * @file Entry file.
 */

import * as reducers from '@/reducers';
import routes from '@/routes';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { connect, Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-snapshot';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

const ConnectedIntlProvider = connect((state: any) => ({
  key: state.i18n.locale,
  locale: state.i18n.locale,
  messages: state.i18n.messages,
}))(IntlProvider);

const store = createStore(combineReducers(reducers), {}, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <ConnectedIntlProvider>
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </ConnectedIntlProvider>
  </Provider>,
  document.getElementById(`app`),
);
