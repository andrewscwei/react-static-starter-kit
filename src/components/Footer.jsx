import styles from '@/components/Footer.pcss';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class Footer extends PureComponent {
  static propTypes = {
    t: PropTypes.object.isRequired,
    changeLocale: PropTypes.func.isRequired
  }

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