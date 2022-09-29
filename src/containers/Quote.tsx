import React, { useContext } from 'react'
import useWindowTitle from '../hooks/useWindowTitle'
import { useLocalizedString } from '../providers/i18n'
import { QuoteContext } from '../providers/quotes/QuoteProvider'
import style from './Quote.module.css'

export default function About() {
  const ltxt = useLocalizedString()
  const quote = useContext(QuoteContext)

  useWindowTitle(ltxt('window-title-quote'))

  return (
    <main>
      {quote && <span className={style.title}>{ltxt('quote-title')}</span>}
      {quote?.text && <span className={style.quote}>{ltxt('quote-text', { text: quote.text })}</span>}
      {quote?.author && <span className={style.author}>{ltxt('quote-author', { author: quote.author })}</span>}
    </main>
  )
}
