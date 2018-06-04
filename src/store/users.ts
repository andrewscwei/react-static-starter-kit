import { ActionType } from '@/enums';
import { Action, UsersLoadedAction, UsersState } from '@/types';
import axios from 'axios';
import { Dispatch } from 'react-redux';

export function fetchUsers() {
  return async (dispatch: Dispatch<Action>) => {
    const res = await axios.get(`//jsonplaceholder.typicode.com/users`);
    const action: UsersLoadedAction = {
      type: ActionType.USERS_LOADED,
      users: res.data,
    };

    dispatch(action);
  };
}

export default function reducer(state: UsersState = { users: [] }, action: Action): UsersState {
  switch (action.type) {
  case ActionType.USERS_LOADED:
    return { ...state, users: (action as UsersLoadedAction).users };
  default:
    return state;
  }
}
