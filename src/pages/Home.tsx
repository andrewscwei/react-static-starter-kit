import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles = require('@/pages/Home.pcss');

const mapStateToProps = (state) => ({ t: state.i18n.messages });
const mapDispatchToProps = (dispatch) => bindActionCreators({ changeLocale }, dispatch);

interface IProps {
  t: { [_: string]: string };
  changeLocale: () => void;
}

class Home extends PureComponent<IProps, {}> {
  public static defaultProps: Partial<IProps> = {
    changeLocale: () => {},
    t: {}
  };

  public render() {
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
