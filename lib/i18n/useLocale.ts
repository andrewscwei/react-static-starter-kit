import { useContext } from 'react'
import { I18nContext } from './I18nProvider.js'

/**
 * Hook for retrieving the current locale.
 *
 * @returns The current locale.
 */
export function useLocale() {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  return context.state.locale
}
