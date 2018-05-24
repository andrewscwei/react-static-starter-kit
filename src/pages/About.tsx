import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { changeLocale } from '@/reducers/i18n';
import { fetchUsers } from '@/reducers/users';
import { Translations } from '@/types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const styles = require(`./About.pcss`);

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
      <div className={styles[`root`]}>
        <Header t={t}/>
        <summary>
          <h1 className={styles[`h1`]}>{t[`about-title`]}</h1>
          {
            this.props.users.map((user) => {
              return (
                <div key={user.id} >
                  <span className={styles[`label`]}>{user.name}</span>
                </div>
              );
            })
          }
        </summary>
        <Footer t={t} changeLocale={changeLocale}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(About);
