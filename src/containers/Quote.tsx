import React, { useContext, useEffect } from 'react'
import { useLocalizedString } from '../providers/i18n'
import { QuoteContext } from '../providers/quotes/QuoteProvider'
import style from './Quote.module.css'

export default function About() {
  const ltxt = useLocalizedString()
  const quote = useContext(QuoteContext)

  useEffect(() => {
    document.title = ltxt('window-title-quote')
  }, [])

  return (
    <main>
      {quote && <span className={style.title}>{ltxt('quote-title')}</span>}
      {quote?.text && <span className={style.quote}>{ltxt('x-quote-text', { x: quote.text })}</span>}
      {quote?.author && <span className={style.author}>{ltxt('x-quote-author', { x: quote.author })}</span>}
    </main>
  )
}
