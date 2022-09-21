import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import selectUsers from '../selectors/selectUsers'
import { AppDispatch, AppState } from '../store'
import { actionFetchUsers, User } from '../store/users'
import { useLtxt } from '../utils/i18n'

export default function About() {
  const ltxt = useLtxt()
  const dispatch = useDispatch<AppDispatch>()
  const users = useSelector((state: AppState) => selectUsers(state.users))

  useEffect(() => {
    document.title = ltxt('window-title-about')
    dispatch(actionFetchUsers())
  }, [])

  return (
    <StyledRoot>
      <h1>{ltxt('about-title')}</h1>
      {
        users.map((user: User) => (
          <div key={user.id} >
            <span>{user.first_name} {user.last_name}</span>
          </div>
        ))
      }
    </StyledRoot>
  )
}

const StyledRoot = styled.div`
  ${props => props.theme.layout.hp}
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: center;
  position: absolute;
  width: 100%;

  h1 {
    ${props => props.theme.texts.h2}
    color: ${props => props.theme.colors.white};
    margin: 0 0 20px;
    max-width: 550px;
    text-align: center;
  }

  span {
    ${props => props.theme.texts.p1}
    color: ${props => props.theme.colors.grey};
    text-align: center;
  }
`
