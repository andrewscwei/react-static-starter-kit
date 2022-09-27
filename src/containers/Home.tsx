import React, { useEffect } from 'react'
import ReactLogo from '../components/ReactLogo'
import { useLocalizedString } from '../modules/i18n'
import style from './Home.module.css'

export default function Home() {
  const ltxt = useLocalizedString()

  useEffect(() => {
    document.title = ltxt('window-title-home')
  }, [])

  return (
    <main>
      <ReactLogo className={style.logo}/>
      <h2 className={style.title}>{ltxt('hello')}</h2>
      <pre className={style.version}>v{__APP_CONFIG__.version} ({__APP_CONFIG__.buildNumber})</pre>
      <p className={style.main}>{ltxt('description') }</p>
    </main>
  )
}
