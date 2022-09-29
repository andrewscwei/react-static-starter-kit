import Polyglot from 'node-polyglot'
import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { getLocaleFromURL, getLocalizedURL, getUnlocalizedURL } from './utils/urls'

interface Translation { [key: string]: Translation | string }

type I18nRouterContextValue = {
  defaultLocale: string
  locale: string
  location: 'path' | 'query'
  supportedLocales: string[]
  getLocalizedPath: (path: string) => string
  getLocalizedString: typeof Polyglot.prototype.t
}

type I18nRouterProviderProps = PropsWithChildren<{
  defaultLocale: I18nRouterContextValue['defaultLocale']
  location?: I18nRouterContextValue['location']
  translations: Record<string, Translation>
}>

export const I18nRouterContext = createContext<I18nRouterContextValue | undefined>(undefined)

/**
 * Custom {@link Routes} container that generates child {@link Route} components for all locales
 * supported by {@link I18nRouterProvider}.
 */
export function I18nRoutes({ children }: PropsWithChildren) {
  const context = useContext(I18nRouterContext)
  if (!context) throw Error('Cannot fetch the value of I18nRouterContext, is the corresponding provider instated?')

  const { defaultLocale, location, supportedLocales } = context

  switch (location) {
  case 'path':
    return (
      <Routes>
        {supportedLocales.map(locale => (
          <Route key={locale} path={locale === defaultLocale ? '/' : locale}>
            {children}
          </Route>
        ))}
      </Routes>
    )
  case 'query':
  default:
    return (
      <Routes>
        <Route path={'/'}>
          {children}
        </Route>
      </Routes>
    )
  }
}

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
  location = 'path',
  translations,
}: I18nRouterProviderProps) {
  const { pathname, search, hash } = useLocation()
  const path = `${pathname}${search}${hash}`
  const supportedLocales = Object.keys(translations)

  const polyglots = useMemo<Record<string, Polyglot>>(() =>
    supportedLocales.reduce((out, locale) => ({
      ...out,
      [locale]: new Polyglot({ locale, phrases: translations[locale] }),
    }), {})
  , [translations])

  const localeInfo = getLocaleFromURL(path, { defaultLocale, location, supportedLocales })
  if (!localeInfo) throw Error(`Unable to infer locale from path <${path}>`)

  const { locale } = localeInfo

  const polyglot = polyglots[locale]
  if (!polyglot) throw Error(`Missing transtions for locale <${locale}>`)

  const value: I18nRouterContextValue = {
    defaultLocale,
    locale,
    location,
    supportedLocales,
    getLocalizedPath: path => locale === defaultLocale ? getUnlocalizedURL(path, { location, supportedLocales }) : getLocalizedURL(path, locale, { defaultLocale, location, supportedLocales }),
    getLocalizedString: (...args) => polyglot.t(...args),
  }

  return (
    <I18nRouterContext.Provider value={value}>
      {children}
    </I18nRouterContext.Provider>
  )
}
