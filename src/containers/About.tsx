import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Action, bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'
import { AppState } from '../store'
import { fetchUsers, User, UsersState } from '../store/users'
import { I18nComponentProps, withI18n } from '../utils/i18n'

type StateProps = {
  users: UsersState
}

type DispatchProps = {
  fetchUsers: typeof fetchUsers
}

type Props = StateProps & DispatchProps & RouteComponentProps & I18nComponentProps

class About extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
    this.props.fetchUsers()
  }

  componentDidMount() {
    document.title = this.props.ltxt('page-title-about')
  }

  render() {
    const { ltxt } = this.props

    return (
      <StyledRoot>
        <h1>{ltxt('about-title')}</h1>
        {
          this.props.users.items.map((user: User) => (
            <div key={user.id} >
              <span>{user.first_name} {user.last_name}</span>
            </div>
          ))
        }
      </StyledRoot>
    )
  }
}

export default connect(
  (state: AppState): StateProps => ({
    users: state.users,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
    fetchUsers,
  }, dispatch),
)(withI18n(About))

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  font-family: ${props => props.theme.fonts.body};
  height: 100%;
  justify-content: center;
  padding: 10% 5%;
  position: absolute;
  width: 100%;

  h1 {
    color: ${props => props.theme.colors.title};
    font-size: 2.4em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0 0 20px;
    max-width: 550px;
    text-align: center;
    text-transform: uppercase;
  }

  span {
    color: ${props => props.theme.colors.text};
    font-weight: 400;
    letter-spacing: .6px;
    line-height: 1.4em;
    text-align: center;
  }
`
