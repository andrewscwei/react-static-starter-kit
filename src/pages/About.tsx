import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { changeLocale } from '@/reducers/i18n';
import { fetchUsers } from '@/reducers/users';
import { Translations } from '@/types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

const Root = styled.div`
  padding: 10% 5%;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: nowrap;
  color: #fff;
  box-sizing: border-box;

  & > summary {
    max-width: 550px;

    & h1 {
      font-size: 2.4em;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin: 0;
    }

    & span {
      font-weight: 400;
      letter-spacing: .6px;
      line-height: 1.4em;
      color: #666;
    }
  }
`;

interface Props {
  users: Array<any>;
  t: Translations;
  changeLocale: (locale: string) => void;
  fetchUsers: () => void;
}

const mapStateToProps = (state): Partial<Props> => ({ users: state.users.users, t: state.i18n.messages });
const mapDispatchToProps = (dispatch): Partial<Props> => bindActionCreators({ changeLocale, fetchUsers }, dispatch);

class About extends PureComponent<Props> {
  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    const { t, changeLocale } = this.props;

    return (
      <Root>
        <Header t={t}/>
        <summary>
          <h1>{t[`about-title`]}</h1>
          {
            this.props.users.map((user) => {
              return (
                <div key={user.id} >
                  <span>{user.name}</span>
                </div>
              );
            })
          }
        </summary>
        <Footer t={t} changeLocale={changeLocale}/>
      </Root>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(About);
