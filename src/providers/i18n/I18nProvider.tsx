import Polyglot from 'node-polyglot'
import React, { createContext, Dispatch, PropsWithChildren, useReducer, useRef } from 'react'
import { getLocalizedURL } from './utils/urls'

interface Translation { [key: string]: Translation | string }

type I18nChangeLocaleAction = {
  type: '@i18n/CHANGE_LOCALE'
  locale: string
}

type I18nResetLocaleAction = {
  type: '@i18n/RESET_LOCALE'
}

type I18nContextValue = {
  state: {
    defaultLocale: string
    locale: string
    polyglots: Record<string, Polyglot>
    supportedLocales: string[]
    getLocalizedPath: (path: string) => string
    getLocalizedString: typeof Polyglot.prototype.t
  }
  dispatch: Dispatch<I18nChangeLocaleAction | I18nResetLocaleAction>
}

type I18nProviderProps = PropsWithChildren<{
  defaultLocale: string
  translations: Record<string, Translation>
}>

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const reducer = (state: I18nContextValue['state'], action: I18nChangeLocaleAction | I18nResetLocaleAction): I18nContextValue['state'] => {
  switch (action.type) {
  case '@i18n/CHANGE_LOCALE':
    return {
      ...state,
      locale: action.locale,
      getLocalizedPath: path => getLocalizedURL(path, action.locale, { defaultLocale: state.defaultLocale, supportedLocales: state.supportedLocales, location: 'path' }),
      getLocalizedString: (...args) => state.polyglots[action.locale].t(...args),
    }
  case '@i18n/RESET_LOCALE':
    return {
      ...state,
      locale: state.defaultLocale,
      getLocalizedPath: path => getLocalizedURL(path, state.defaultLocale, { defaultLocale: state.defaultLocale, supportedLocales: state.supportedLocales, location: 'path' }),
      getLocalizedString: (...args) => state.polyglots[state.defaultLocale].t(...args),
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
    getLocalizedPath: path => getLocalizedURL(path, defaultLocale, { defaultLocale, supportedLocales, location: 'path' }),
    getLocalizedString: (...args) => polyglots.current[defaultLocale].t(...args),
  })

  return (
    <I18nContext.Provider value={{ state, dispatch }}>
      {children}
    </I18nContext.Provider>
  )
}
