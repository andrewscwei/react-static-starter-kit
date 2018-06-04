import { Action, ActionType, UsersLoadedAction, UsersState } from '@/types';
import { Dispatch } from 'react-redux';
import request from 'superagent';

export function fetchUsers() {
  return async (dispatch: Dispatch<Action>) => {
    const res = await request.get(`//jsonplaceholder.typicode.com/users`);
    const action: UsersLoadedAction = {
      type: ActionType.USERS_LOADED,
      users: res.body,
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
