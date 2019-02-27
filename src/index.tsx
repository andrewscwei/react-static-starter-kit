/**
 * @file Entry file.
 */

import React from 'react';
import { hydrate, render } from 'react-dom';
import { IntlProvider } from 'react-intl';
import { connect, Provider } from 'react-redux';
import { BrowserRouter as Router, Route, RouteComponentProps } from 'react-router-dom';
import App from './containers/App';
import store from './store';

const ConnectedIntlProvider = connect((state: any) => ({
  key: state.intl.locale,
  locale: state.intl.locale,
  messages: state.intl.translations,
}))(IntlProvider);

// Generator for base markup.
const markup = () => (
  <Provider store={store}>
    <ConnectedIntlProvider>
      <Router>
        <Route render={(routeProps: RouteComponentProps<any>) => (
          <App route={routeProps}/>
        )}/>
      </Router>
    </ConnectedIntlProvider>
  </Provider>
);

// Render the app.
if (process.env.NODE_ENV === 'development') {
  render(markup(), document.getElementById('app'));
}
else {
  hydrate(markup(), document.getElementById('app'));
}
