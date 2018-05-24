import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { changeLocale } from '@/reducers/i18n';
import { Translations } from '@/types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const styles = require('@/pages/Home.pcss');

interface Props {
  t: Translations;
  changeLocale: (locale: string) => void;
}

const mapStateToProps = (state): Partial<Props> => ({ t: state.i18n.messages });
const mapDispatchToProps = (dispatch): Partial<Props> => bindActionCreators({ changeLocale: changeLocale }, dispatch);

class Home extends PureComponent<Props> {
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
