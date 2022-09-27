import { useContext } from 'react'
import { I18nContext } from '../I18nProvider'
import { I18nRouterContext } from '../I18nRouterProvider'
import { getLocalizedURL, getUnlocalizedURL } from '../utils/urls'

/**
 * Hook for retrieving the path localizing function for the current locale.
 *
 * @returns The path localizing function.
 */
export default function useLocalizedPath() {
  const routerContext = useContext(I18nRouterContext)
  const context = useContext(I18nContext)

  if (context) {
    const { locale: currentLocale, defaultLocale, supportedLocales } = context.state

    return (path: string, locale: string = currentLocale) => getLocalizedURL(path, locale, { defaultLocale, location: 'path', supportedLocales })
  }
  else if (routerContext) {
    const { locale: currentLocale, defaultLocale, supportedLocales } = routerContext

    return (path: string, locale: string = currentLocale) => {
      if (locale === defaultLocale) {
        return getUnlocalizedURL(path, { location: 'path', supportedLocales })
      }
      else {
        return getLocalizedURL(path, locale, { defaultLocale, location: 'path', supportedLocales })
      }
    }
  }
  else {
    throw Error('Cannot fetch the value of any compatible i18n context, is the corresponding provider instated?')
  }
}
