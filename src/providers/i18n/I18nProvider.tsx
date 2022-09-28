import Polyglot from 'node-polyglot'
import React, { createContext, Dispatch, PropsWithChildren, useReducer, useRef } from 'react'

interface Translation { [key: string]: Translation | string }

type I18nChangeLocaleAction = {
  type: '@i18n/CHANGE_LOCALE'
  locale: string
}

type I18nContextValue = {
  state: {
    defaultLocale: string
    locale: string
    polyglots: Record<string, Polyglot>
    supportedLocales: string[]
    getLocalizedString: typeof Polyglot.prototype.t
  }
  dispatch: Dispatch<I18nChangeLocaleAction>
}

type I18nProviderProps = PropsWithChildren<{
  defaultLocale: string
  translations: Record<string, Translation>
}>

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const reducer = (state: I18nContextValue['state'], action: I18nChangeLocaleAction): I18nContextValue['state'] => {
  switch (action.type) {
  case '@i18n/CHANGE_LOCALE':
    return {
      ...state,
      locale: action.locale,
      getLocalizedString: (...args) => state.polyglots[action.locale].t(...args),
    }
  default:
    return state
  }
}

/**
 * Context provider whose value is the current i18n state and the dispatch function for modifying
 * the i18n state.
 *
 * @param props - See {@link I18nProviderProps}.
 *
 * @returns The context provider.
 */
export default function I18nProvider({
  children,
  defaultLocale,
  translations,
}: I18nProviderProps) {
  const supportedLocales = Object.keys(translations)

  const polyglots = useRef<Record<string, Polyglot>>(supportedLocales.reduce((prev, curr) => ({
    ...prev,
    [curr]: new Polyglot({ locale: curr, phrases: translations[curr] }),
  }), {}))

  if (!polyglots.current[defaultLocale]) throw Error(`Missing transtions for default locale <${defaultLocale}>`)

  const [state, dispatch] = useReducer(reducer, {
    defaultLocale,
    locale: defaultLocale,
    polyglots: polyglots.current,
    supportedLocales,
    getLocalizedString: (...args) => polyglots.current[defaultLocale].t(...args),
  })

  return (
    <I18nContext.Provider value={{ state, dispatch }}>
      {children}
    </I18nContext.Provider>
  )
}
