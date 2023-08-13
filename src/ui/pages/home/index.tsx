import React from 'react'
import useMetaTags from '../../../../lib/dom/useMetaTags'
import { useLocalizedString } from '../../../../lib/providers/I18nProvider'
import { VERSION } from '../../../app.conf'
import ReactLogo from '../../components/ReactLogo'
import style from './index.module.css'

export default function Home() {
  const ltxt = useLocalizedString()

  useMetaTags({ title: ltxt('window-title-home') })

  return (
    <>
      <main>
        <div className={style.content}>
          <ReactLogo className={style.logo}/>
          <section>
            <h1 className={style.title}>{ltxt('hello')}</h1>
            <code className={style.version}>{VERSION}</code>
            <span>{ltxt('description') }</span>
          </section>
        </div>
      </main>
    </>
  )
}
