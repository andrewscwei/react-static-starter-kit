import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { I18nContext } from '../providers/I18nProvider'
import { I18nRouterContext } from '../providers/I18nRouterProvider'
import { getLocalizedURL, getUnlocalizedURL } from '../utils/urls'

/**
 * Hook for retrieving the change locale function.
 *
 * @returns The change locale function.
 */
export default function useChangeLocale() {
  const routerContext = useContext(I18nRouterContext)
  const context = useContext(I18nContext)

  if (context) {
    return (locale: string) => context.dispatch({
      type: '@i18n/CHANGE_LOCALE',
      locale,
    })
  }
  else if (routerContext) {
    const { defaultLocale, supportedLocales } = routerContext
    const location = useLocation()
    const navigate = useNavigate()

    return (locale: string) => {
      const newPath = locale === defaultLocale
        ? getUnlocalizedURL(location.pathname, { location: 'path', supportedLocales })
        : getLocalizedURL(location.pathname, locale, { defaultLocale, location: 'path', supportedLocales })

      navigate({
        pathname: newPath,
        search: location.search,
        hash: location.hash,
      }, {
        replace: true,
      })
    }
  }
  else {
    throw Error('Cannot fetch the value of any compatible i18n context, is the corresponding provider instated?')
  }
}
