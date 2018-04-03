import styles from '@/pages/Home.pcss';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { changeLocale } from '@/reducers/i18n';

const mapStateToProps = (state) => ({ t: state.i18n.messages });
const mapDispatchToProps = (dispatch) => bindActionCreators({ changeLocale }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
export default class Home extends PureComponent {
  static propTypes = {
    t: PropTypes.object.isRequired,
    changeLocale: PropTypes.func.isRequired
  }

  static defaultProps = {
    t: {},
    changeLocale: () => {}
  }

  render() {
    const { t, changeLocale } = this.props;

    return (
      <div className={styles[`root`]}>
        <Header t={t}/>
        <summary>
          <h1 className={styles[`h1`]}>{t[`hello`]}</h1>
          <p className={styles[`description`]}>{t[`description`]}</p>
        </summary>
        <Footer t={t} changeLocale={changeLocale}/>
      </div>
    );
  }
}
