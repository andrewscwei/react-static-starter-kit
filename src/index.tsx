/**
 * @file Entry file.
 */

import App from '@/containers/App';
import store from '@/store';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { connect, Provider } from 'react-redux';
import { BrowserRouter as Router, Route, RouteComponentProps } from 'react-router-dom';
import { render } from 'react-snapshot';

const ConnectedIntlProvider = connect((state: any) => ({
  key: state.intl.locale,
  locale: state.intl.locale,
  messages: state.intl.translations,
}))(IntlProvider);

render(
  <Provider store={store}>
    <ConnectedIntlProvider>
      <Router>
        <Route render={(routeProps: RouteComponentProps<any>) => (
          <App route={routeProps}/>
        )}/>
      </Router>
    </ConnectedIntlProvider>
  </Provider>,
  document.getElementById(`app`),
);
