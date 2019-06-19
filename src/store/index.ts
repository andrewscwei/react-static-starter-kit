import _ from 'lodash';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import i18n, { I18nState } from './i18n';
import users, { UsersState } from './users';

const composeEnhancers = process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface AppState {
  i18n: I18nState;
  users: UsersState;
}

export const reducer = combineReducers({ i18n, users });

const initialState = window.__INITIAL_STATE__;
delete window.__INITIAL_STATE__;

const store = createStore(reducer, initialState || {}, composeEnhancers(applyMiddleware(thunk)));

window.snapSaveState = () => ({
  __INITIAL_STATE__: _.omit(store.getState(), 'i18n'),
});

export default store;
