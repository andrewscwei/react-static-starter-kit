import React, { useEffect } from 'react'
import useFetch from '../hooks/useFetch'
import useWindowTitle from '../hooks/useWindowTitle'
import GetQuote from '../interactors/useCases/GetQuote'
import { useLocalizedString } from '../providers/i18n'
import style from './Quote.module.css'

export default function About() {
  const ltxt = useLocalizedString()
  const [getQuote, quote] = useFetch(GetQuote)

  useWindowTitle(ltxt('window-title-quote'))

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
