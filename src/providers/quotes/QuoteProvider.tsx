import React, { createContext, PropsWithChildren, useEffect, useRef, useState } from 'react'

type Quote = {
  author: string
  text: string
}

type QuoteContextValue = Quote

type QuoteProviderProps = PropsWithChildren

export const QuoteContext = createContext<QuoteContextValue | undefined>(undefined)

export default function QuoteProvider({
  children,
}: QuoteProviderProps) {
  const request = useRef<AbortController>()

  const [users, setQuote] = useState<Quote>()

  useEffect(() => {
    request.current?.abort()

    const ac = new AbortController()
    request.current = ac

    fetch('https://type.fit/api/quotes', {
      signal: ac.signal,
    })
      .then(res => res.json())
      .then(quotes => {
        const { author, text } = quotes[Math.floor(Math.random() * quotes.length)]
        setQuote({ author, text })
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        setQuote(undefined)
        throw err
      })

    return () => {
      request.current?.abort()
    }
  }, [])

  return (
    <QuoteContext.Provider value={users}>
      {children}
    </QuoteContext.Provider>
  )
}
