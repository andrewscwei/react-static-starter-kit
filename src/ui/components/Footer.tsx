import React, { type HTMLAttributes } from 'react'
import { useChangeLocale, useLocalizedString } from '../../../lib/i18n'
import $$GitHubLogo from '../assets/images/github-logo.svg'
import styles from './Footer.module.css'

type Props = HTMLAttributes<HTMLElement>

export function Footer({ ...props }: Props) {
  const ltxt = useLocalizedString()
  const changeLocale = useChangeLocale()

  return (
    <footer {...props} className={styles.root}>
      <nav className={styles.nav}>
        <a href='https://github.com/andrewscwei/react-static-starter-kit'>
          <img src={$$GitHubLogo} alt='GitHub' />
        </a>
      </nav>
      <button className={styles.button} onClick={() => changeLocale('en')}>{ltxt('en')}</button>
      <button className={styles.button} onClick={() => changeLocale('ja')}>{ltxt('ja')}</button>
    </footer>
  )
}
