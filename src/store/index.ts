import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import i18n, { I18nState } from './i18n';
import prismic, { PrismicState } from './prismic';

const composeEnhancers = process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface AppState {
  i18n: I18nState;
  prismic: PrismicState;
}

export const reducer = combineReducers({ i18n, prismic });

const initialState = window.__INITIAL_STATE__;
delete window.__INITIAL_STATE__;

const store = createStore(reducer, initialState || {}, composeEnhancers(applyMiddleware(thunk)));

window.snapSaveState = () => ({
  __INITIAL_STATE__: store.getState(),
});

export default store;
