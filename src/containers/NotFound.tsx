import React from 'react'
import useWindowTitle from '../hooks/useWindowTitle'
import { useLocalizedString } from '../providers/i18n'
import style from './NotFound.module.css'

export default function NotFound() {
  const ltxt = useLocalizedString()

  useWindowTitle(ltxt('window-title-not-found'))

  return (
    <main>
      <h2 className={style.title}>{ltxt('not-found-title') }</h2>
    </main>
  )
}
