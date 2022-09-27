import React, { useEffect } from 'react'
import { useLocalizedString } from '../contexts/i18n'
import style from './NotFound.module.css'

export default function NotFound() {
  const ltxt = useLocalizedString()

  useEffect(() => {
    document.title = ltxt('window-title-not-found')
  })

  return (
    <main>
      <h2 className={style.title}>{ltxt('not-found-title') }</h2>
    </main>
  )
}
