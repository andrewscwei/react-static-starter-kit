import { createContext, type PropsWithChildren } from 'react'
import { type Metadata } from './types/index.js'

type MetaProviderProps = PropsWithChildren<MetaContextValue>

type MetaContextValue = {
  metadata?: Metadata
}

export function MetaProvider({ children, metadata }: MetaProviderProps) {
  return (
    <MetaContext.Provider value={{ metadata }}>
      {children}
    </MetaContext.Provider>

  )
}

export const MetaContext = createContext<MetaContextValue | undefined>(undefined)

Object.defineProperty(MetaContext, 'displayName', { value: 'Meta' })
