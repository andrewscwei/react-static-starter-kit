import styles from '@/pages/About.pcss';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { changeLocale } from '@/reducers/i18n';
import { connect } from 'react-redux';
import { fetchUsers } from '@/reducers/users';

const mapStateToProps = (state) => ({ users: state.users.items, t: state.i18n.messages });
const mapDispatchToProps = (dispatch) => bindActionCreators({ changeLocale, fetchUsers }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
export default class About extends Component {
  static propTypes = {
    t: PropTypes.object.isRequired,
    users: PropTypes.array,
    changeLocale: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired
  }

  static fetchData(store) {
    return store.dispatch(fetchUsers());
  }

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
            this.props.users.map(user => {
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
