import 'isomorphic-fetch';
import { Action } from 'redux';

export const USERS_LOADED = `@users/loaded`;

interface IUsersState {
  items: ReadonlyArray<{}>;
}

const initialState: IUsersState = {
  items: []
};

export default function reducer(state: IUsersState = initialState, action): IUsersState {
  switch (action.type) {
  case USERS_LOADED:
    return { ...state,  items: action.items };
  default:
    return state;
  }
}

export function fetchUsers() {
  return async (dispatch) => {
    const res = await fetch(`//jsonplaceholder.typicode.com/users`);
    const users = await res.json();

    dispatch({
      items: users,
      type: USERS_LOADED
    });
  };
}
