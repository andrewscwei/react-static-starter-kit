import { applyMiddleware, combineReducers, compose, createStore as _createStore } from 'redux'
import thunk from 'redux-thunk'
import users from './users'

const composeEnhancers = process.env.NODE_ENV === 'development' && (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose)|| compose

export type AppState = NonNullable<Parameters<typeof reducer>[0]>

export type AppAction = NonNullable<Parameters<typeof reducer>[1]>

export const reducer = combineReducers({
  users,
})

export default function createStore() {
  const initialState = window.__INITIAL_STATE__
  delete window.__INITIAL_STATE__

  const store = _createStore(reducer, initialState || {}, composeEnhancers(applyMiddleware(thunk)))

  return store
}
