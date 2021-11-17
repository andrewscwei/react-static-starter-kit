import { Action, Dispatch } from 'redux'

let request: AbortController | undefined

export type User = {
  [key: string]: any
}

export enum UsersActionType {
  UPDATED = 'users/UPDATED',
}

export type UsersAction = Action<UsersActionType> & {
  newState: UsersState
}

export type UsersState = User[]

const initialState: UsersState = []

export function fetchUsers() {
  return async (dispatch: Dispatch<Action>) => {
    if (request) request.abort()

    request = new AbortController()

    const res = await fetch('https://reqres.in/api/users', {
      signal: request.signal,
    })
      .catch(err => {
        if (err.name !== 'AbortError') throw err
      })

    if (!res) return

    request = undefined

    const { data: users } = await res.json()
    const action: UsersAction = {
      type: UsersActionType.UPDATED,
      newState: users,
    }

    dispatch(action)
  }
}

export default function reducer(state = initialState, action: UsersAction): UsersState {
  switch (action.type) {
  case UsersActionType.UPDATED:
    return action.newState
  default:
    return state
  }
}
