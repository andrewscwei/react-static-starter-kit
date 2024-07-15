import { useMeta } from '@lib/dom/index.js'
import { useLocalizedString } from '@lib/i18n/index.js'
import { Await, useLoaderData } from 'react-router'
import { type Quote } from '../../../useCases/GetQuote.js'
import styles from './index.module.css'

export function Component() {
  const ltxt = useLocalizedString()
  const { quote: quotePromise } = useLoaderData() as any

  useMeta({
    title: ltxt('window-title-quote'),
    description: ltxt('description'),
    url: window.location.hostname + window.location.pathname,
  })

  return (
    <main>
      <Await resolve={quotePromise}>
        {(quote: Quote) => (
          <>
            <span className={styles.title}>{ltxt('quote-title')}</span>
            {quote.text && <span className={styles.quote} id='quote'>{ltxt('quote-text', { text: quote.text })}</span>}
            {quote.author && <span className={styles.author}>{ltxt('quote-author', { author: quote.author })}</span>}
          </>
        )}
      </Await>
    </main>
  )
}
