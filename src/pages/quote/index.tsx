import React, { useEffect } from 'react'
import Head from '../../components/Head'
import GetQuote from '../../interactors/apis/GetQuote'
import { useInteractor } from '../../interactors/UseCase'
import { useLocalizedString } from '../../providers/I18nProvider'
import style from './index.module.css'

export default function About() {
  const ltxt = useLocalizedString()
  const { run: getQuote, value: quote } = useInteractor(GetQuote)

  useEffect(() => {
    getQuote()
  }, [])

  return (
    <>
      <Head title={ltxt('window-title-quote')}/>
      <main>
        {quote && <span className={style.title}>{ltxt('quote-title')}</span>}
        {quote?.text && <span className={style.quote}>{ltxt('quote-text', { text: quote.text })}</span>}
        {quote?.author && <span className={style.author}>{ltxt('quote-author', { author: quote.author })}</span>}
      </main>
    </>
  )
}
