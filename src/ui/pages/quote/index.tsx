import React, { useEffect } from 'react'
import useMetaTags from '../../../../lib/dom/useMetaTags'
import { useLocalizedString } from '../../../../lib/i18n'
import { useInteractor } from '../../../../lib/interactors/Interactor'
import GetQuote from '../../../useCases/GetQuote'
import style from './index.module.css'

export default function About() {
  const ltxt = useLocalizedString()
  const { run: getQuote, value: quote } = useInteractor(GetQuote)

  useMetaTags({ title: ltxt('window-title-quote') })

  useEffect(() => {
    getQuote()
  }, [])

  return (
    <main>
      {quote && <span className={style.title}>{ltxt('quote-title')}</span>}
      {quote?.text && <span className={style.quote}>{ltxt('quote-text', { text: quote.text })}</span>}
      {quote?.author && <span className={style.author}>{ltxt('quote-author', { author: quote.author })}</span>}
    </main>
  )
}
