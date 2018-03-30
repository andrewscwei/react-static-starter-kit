import styles from '@/containers/Home.pcss';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';

@translate()
export default class Home extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
  }

  render() {
    const { t, i18n } = this.props;

    return (
      <div className={styles[`root`]}>
        <Header t={t}/>
        <summary>
          <h1 className={styles[`h1`]}>{t(`hello`)}</h1>
          <p className={styles[`description`]}>{t(`description`)}</p>
        </summary>
        <Footer t={t} i18n={i18n}/>
      </div>
    );
  }
}
