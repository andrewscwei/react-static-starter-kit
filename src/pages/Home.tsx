import React from 'react'
import Head from '../components/Head'
import ReactLogo from '../components/ReactLogo'
import { useLocalizedString } from '../providers/i18n'
import style from './Home.module.css'

export default function Home() {
  const ltxt = useLocalizedString()

  return (
    <>
      <Head title={ltxt('window-title-home')}/>
      <main>
        <div className={style.content}>
          <ReactLogo className={style.logo}/>
          <section>
            <h1 className={style.title}>{ltxt('hello')}</h1>
            <code className={style.version}>{`v${__APP_CONFIG__.version} (${__APP_CONFIG__.buildNumber})`}</code>
            <span>{ltxt('description') }</span>
          </section>
        </div>
      </main>
    </>
  )
}
