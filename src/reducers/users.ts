import { ActionType } from '@/enums';
import { Action } from '@/types';
import axios from 'axios';

export interface State {
  users: ReadonlyArray<{}>;
}

const initialState: State = {
  users: [],
};

export interface UserLoadedAction extends Action {
  users: Array<{}>;
}

export function fetchUsers() {
  return async (dispatch) => {
    const res = await axios.get(`//jsonplaceholder.typicode.com/users`);

    dispatch({
      type: ActionType.USERS_LOADED,
      users: res.data,
    });
  };
}

export default function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
  case ActionType.USERS_LOADED:
    return { ...state, users: (action as UserLoadedAction).users };
  default:
    return state;
  }
}
