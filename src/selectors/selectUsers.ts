import { createSelector } from 'reselect'
import { UsersState } from '../store/users'

export default createSelector([
  (users: UsersState) => users,
], users => users)
