import styles from '@/containers/About.pcss';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUsers } from '@/reducers/users';
import { translate } from 'react-i18next';

const mapStateToProps = (state) => ({ users: state.users.items });
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUsers }, dispatch);

@translate()
@connect(mapStateToProps, mapDispatchToProps)
export default class About extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    users: PropTypes.array,
    fetchUsers: PropTypes.func
  }

  static fetchData(store) {
    return store.dispatch(fetchUsers());
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    const { t, i18n } = this.props;

    return (
      <div className={styles[`root`]}>
        <Header t={t}/>
        <summary>
          <h1 className={styles[`h1`]}>{t(`about-title`)}</h1>
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
        <Footer t={t} i18n={i18n}/>
      </div>
    );
  }
}
