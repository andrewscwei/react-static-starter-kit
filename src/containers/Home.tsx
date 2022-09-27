import React, { useEffect } from 'react'
import ReactLogo from '../components/ReactLogo'
import { useLocalizedString } from '../providers/i18n'
import style from './Home.module.css'

export default function Home() {
  const ltxt = useLocalizedString()

  useEffect(() => {
    document.title = ltxt('window-title-home')
  }, [])

  return (
    <main>
      <ReactLogo className={style.logo}/>
      <h1 className={style.title}>{ltxt('hello')}</h1>
      <pre className={style.version}>v{__CONFIG__.version} ({__CONFIG__.buildNumber})</pre>
      <p className={style.main}>{ltxt('description') }</p>
    </main>
  )
}
