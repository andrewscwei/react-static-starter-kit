import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocalizedString } from '../providers/i18n'
import selectUsers from '../selectors/selectUsers'
import { AppDispatch, AppState } from '../store'
import { actionFetchUsers } from '../store/users'
import style from './About.module.css'

export default function About() {
  const ltxt = useLocalizedString()
  const dispatch = useDispatch<AppDispatch>()
  const users = useSelector((state: AppState) => selectUsers(state.users))

  useEffect(() => {
    document.title = ltxt('window-title-about')
    dispatch(actionFetchUsers())
  }, [])

  return (
    <main>
      <h2 className={style.title}>{ltxt('about-title')}</h2>
      {users.map(user => (
        <div className={style.content} key={user.id} >
          <span>{user.first_name} {user.last_name}</span>
        </div>
      ))}
    </main>
  )
}
