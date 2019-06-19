
let request = undefined;

export const UsersActionType = {
  USERS_LOADED: 'users-loaded',
};

const initialState = {
  items: [],
};

export function fetchUsers() {
  return async dispatch => {
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
    const action = {
      type: UsersActionType.USERS_LOADED,
      payload: {
        items,
      },
    };

    dispatch(action);
  };
}

export default function reducer(state = initialState, action) {
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
