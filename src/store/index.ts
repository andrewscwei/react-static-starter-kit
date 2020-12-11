import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import users from './users'

const composeEnhancers = process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export type AppState = NonNullable<Parameters<typeof reducer>[0]>

export type AppAction = NonNullable<Parameters<typeof reducer>[1]>

export const reducer = combineReducers({ users })

const initialState = window.__INITIAL_STATE__
delete window.__INITIAL_STATE__

const store = createStore(reducer, initialState || {}, composeEnhancers(applyMiddleware(thunk)))

window.snapSaveState = () => ({
  __INITIAL_STATE__: store.getState(),
})

export default store
