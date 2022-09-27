import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { I18nContext } from '../providers/I18nProvider'
import { I18nRouterContext } from '../providers/I18nRouterProvider'
import { getUnlocalizedURL } from '../utils/urls'

/**
 * Hook for retrieving the reset locale function.
 *
 * @returns The reset locale function.
 */
export default function useResetLocale() {
  const routerContext = useContext(I18nRouterContext)
  const context = useContext(I18nContext)

  if (context) {
    return () => context.dispatch({
      type: '@i18n/RESET_LOCALE',
    })
  }
  else if (routerContext) {
    const { supportedLocales } = routerContext
    const location = useLocation()
    const navigate = useNavigate()

    return () => {
      const newPath = getUnlocalizedURL(location.pathname, { location: 'path', supportedLocales })

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
