import { fetchUsers } from '@/store/users';
import { User } from '@/types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

const StyledRoot = styled.div`
  align-items: flex-start;
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

  & > summary {
    max-width: 550px;

    & h1 {
      color: ${props => props.theme.titleColor};
      font-size: 2.4em;
      font-weight: 700;
      letter-spacing: 3px;
      margin: 0;
      text-transform: uppercase;
    }

    & span {
      color: ${props => props.theme.textColor};
      font-weight: 400;
      letter-spacing: .6px;
      line-height: 1.4em;
    }
  }
`;

interface Props {
  t: TranslationData;
  users: ReadonlyArray<User>;
  fetchUsers(): void;
}

const mapStateToProps = (state: any): Partial<Props> => ({ users: state.users.users, t: state.intl.translations });
const mapDispatchToProps = (dispatch: any): Partial<Props> => bindActionCreators({ fetchUsers }, dispatch);

class About extends PureComponent<Props> {
  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    const { t } = this.props;

    return (
      <StyledRoot>
        <summary>
          <h1>{t[`about-title`]}</h1>
          {
            this.props.users.map(user => {
              return (
                <div key={user.id} >
                  <span>{user.name}</span>
                </div>
              );
            })
          }
        </summary>
      </StyledRoot>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(About);
