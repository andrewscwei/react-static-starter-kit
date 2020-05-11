
let request = undefined;

export const UsersActionType = {
  LOADED: 'users/LOADED',
};

const initialState = {
  items: [],
};

export function fetchUsers() {
  return async dispatch => {
    if (request) request.abort();

    request = new AbortController();

    const res = await fetch('https://reqres.in/api/users', {
      signal: request.signal,
    })
      .catch(err => {
        if (err.name !== 'AbortError') throw err;
      });

    if (!res) return;

    request = undefined;

    const { data: items } = await res.json();
    const action = {
      type: UsersActionType.LOADED,
      payload: {
        items,
      },
    };

    dispatch(action);
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case UsersActionType.LOADED:
    return {
      ...state,
      ...action.payload,
    };
  default:
    return state;
  }
}
