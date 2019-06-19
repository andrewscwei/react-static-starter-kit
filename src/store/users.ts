import { Action, Dispatch } from 'redux';

let request: AbortController | undefined;

export interface User {
  [key: string]: any;
}

export enum UsersActionType {
  USERS_LOADED = 'users-loaded',
}

export interface UsersAction extends Action<UsersActionType> {
  payload: Partial<UsersState>;
}

export interface UsersState {
  items: ReadonlyArray<User>;
}

const initialState: UsersState = {
  items: [],
};

export function fetchUsers() {
  return async (dispatch: Dispatch<Action>) => {
    if (request) request.abort();

    request = new AbortController();

    const res = await fetch('//jsonplaceholder.typicode.com/users', {
      signal: request.signal,
    })
      .catch(err => {
        if (err.name !== 'AbortError') throw err;
      });

    if (!res) return;

    request = undefined;

    const items = await res.json();
    const action: UsersAction = {
      type: UsersActionType.USERS_LOADED,
      payload: {
        items,
      },
    };

    dispatch(action);
  };
}

export default function reducer(state = initialState, action: UsersAction): UsersState {
  switch (action.type) {
  case UsersActionType.USERS_LOADED:
    return {
      ...state,
      ...action.payload,
    };
  default:
    return state;
  }
}
