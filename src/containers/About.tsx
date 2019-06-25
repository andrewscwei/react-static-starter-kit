import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import withPageTitle from '../decorators/withPageTitle';
import { AppState } from '../store';
import { I18nState } from '../store/i18n';
import { fetchUsers, User, UsersState } from '../store/users';

interface StateProps {
  i18n: I18nState;
  users: UsersState;
}

interface DispatchProps {
  fetchUsers(): void;
}

interface OwnProps {

}

export interface Props extends StateProps, DispatchProps, OwnProps {}

export interface State {

}

class About extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.props.fetchUsers();
  }

  render() {
    const { i18n } = this.props;

    return (
      <StyledRoot>
        <h1>{i18n.ltxt('about-title') }</h1>
        {
          this.props.users.items.map((user: User) => {
            return (
              <div key={user.id} >
                <span>{user.name}</span>
              </div>
            );
          })
        }
      </StyledRoot>
    );
  }
}

export default connect(
  (state: AppState): StateProps => ({
    i18n: state.i18n,
    users: state.users,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
    fetchUsers,
  }, dispatch),
)(withPageTitle('about')(About));

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  font-family: ${props => props.theme.font};
  height: 100%;
  justify-content: center;
  padding: 10% 5%;
  position: absolute;
  width: 100%;

  h1 {
    color: ${props => props.theme.titleColor};
    font-size: 2.4em;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0 0 20px;
    max-width: 550px;
    text-align: center;
    text-transform: uppercase;
  }

  span {
    color: ${props => props.theme.textColor};
    font-weight: 400;
    letter-spacing: .6px;
    line-height: 1.4em;
    text-align: center;
  }
`;
