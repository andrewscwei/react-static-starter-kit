import { Translations } from '@/types';
import React, { PureComponent } from 'react';

const styles = require(`@/components/Footer.pcss`);

interface Props {
  t: Translations;
  changeLocale: (locale: string) => void;
}

export default class Footer extends PureComponent<Props> {
  render() {
    const { t, changeLocale } = this.props;

    return (
      <footer className={styles[`root`]}>
        <nav className={styles[`nav`]}>
          <a className={styles[`github-button`]} href='https://github.com/andrewscwei/react-static-starter-kit'/>
        </nav>
        <button className={styles[`locale-button`]} onClick={() => changeLocale(`en`)}>{t[`en`]}</button>
        <button className={styles[`locale-button`]} onClick={() => changeLocale(`ja`)}>{t[`jp`]}</button>
      </footer>
    );
  }
}
