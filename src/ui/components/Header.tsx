import { useLocalizedPath, useLocalizedString } from '@lib/i18n'
import React, { type HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './Header.module.css'

type Props = HTMLAttributes<HTMLElement>

export function Header({ ...props }: Readonly<Props>) {
  const ltxt = useLocalizedString()
  const lpath = useLocalizedPath()

  return (
    <header {...props} className={styles.root}>
      <Link className={styles.link} to={lpath('/')}>{ltxt('nav-title-home') }</Link>
      <Link className={styles.link} to={lpath('/quote')}>{ltxt('nav-title-quote') }</Link>
    </header>
  )
}
