/**
 * @file Entry file.
 */

import React from 'react';
import { hydrate, render } from 'react-dom';
import { IntlProvider } from 'react-intl';
import { connect, Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'whatwg-fetch';
import Worker from 'worker-loader!./workers/web';
import App from './containers/App';
import store from './store';

if (process.env.NODE_ENV === 'development') {
  window.localStorage.debug = 'app*,worker*';
}

const debug = require('debug')('app');
const worker = new Worker();

worker.postMessage({ message: 'Hello, world!' });
worker.addEventListener('message', event => {
  debug(event.data.message);
});

const ConnectedIntlProvider = connect((state) => ({
  key: state.intl.locale,
  locale: state.intl.locale,
  messages: state.intl.translations,
}))(IntlProvider);

// Generator for base markup.
const markup = () => (
  <Provider store={store}>
    <ConnectedIntlProvider>
      <Router>
        <Route render={(routeProps) => (
          <App route={routeProps}/>
        )}/>
      </Router>
    </ConnectedIntlProvider>
  </Provider>
);

// Render the app.
const root = document.getElementById('app');

if (root.hasChildNodes() && process.env.NODE_ENV !== 'development') {
  hydrate(markup(), root);
}
else {
  render(markup(), root);
}
