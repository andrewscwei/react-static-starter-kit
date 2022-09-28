import Polyglot from 'node-polyglot'
import React, { createContext, PropsWithChildren, useRef } from 'react'
import { useLocation } from 'react-router'
import { getLocaleFromURL, getLocalizedURL } from './utils/urls'

interface Translation { [key: string]: Translation | string }

type I18nRouterContextValue = {
  defaultLocale: string
  locale: string
  supportedLocales: string[]
  getLocalizedPath: (path: string) => string
  getLocalizedString: typeof Polyglot.prototype.t
}

type I18nRouterProviderProps = PropsWithChildren<{
  defaultLocale: string
  translations: Record<string, Translation>
}>

export const I18nRouterContext = createContext<I18nRouterContextValue | undefined>(undefined)

/**
 * Context provider whose value is the current i18n state. With this provider, the current locale
 * cannot be modified manually and is instead inferred from the router path.
 *
 * @param props - See {@link I18nRouterProviderProps}.
 *
 * @returns The context provider.
 */
export default function I18nRouterProvider({
  children,
  defaultLocale,
  translations,
}: I18nRouterProviderProps) {
  const { pathname: path } = useLocation()
  const supportedLocales = Object.keys(translations)

  const polyglots = useRef<Record<string, Polyglot>>(supportedLocales.reduce((prev, curr) => ({
    ...prev,
    [curr]: new Polyglot({ locale: curr, phrases: translations[curr] }),
  }), {}))

  const localeInfo = getLocaleFromURL(path, { defaultLocale, location: 'path', supportedLocales })
  if (!localeInfo) throw Error(`Unable to infer locale from path <${location.pathname}>`)

  const { locale } = localeInfo

  const polyglot = polyglots.current[locale]
  if (!polyglot) throw Error(`Missing transtions for locale <${locale}>`)

  const value: I18nRouterContextValue = {
    defaultLocale,
    locale,
    supportedLocales,
    getLocalizedPath: path => getLocalizedURL(path, locale, { defaultLocale, supportedLocales, location: 'path' }),
    getLocalizedString: (...args) => polyglot.t(...args),
  }

  return (
    <I18nRouterContext.Provider value={value}>
      {children}
    </I18nRouterContext.Provider>
  )
}
