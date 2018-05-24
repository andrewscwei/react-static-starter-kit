import { Translations } from '@/types';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

const styles = require(`@/components/Header.pcss`);

export interface Props {
  t: Translations;
}

export default class Header extends PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <header className={styles[`root`]}>
        <Link className={styles[`link`]} to='/'>{t[`home`]}</Link>
        <Link className={styles[`link`]} to='/about/'>{t[`about`]}</Link>
      </header>
    );
  }
}
