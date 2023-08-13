import { useContext } from 'react'
import { I18nContext } from './I18nProvider'

/**
 * Hook for retrieving the path localizing function for the current locale.
 *
 * @returns The path localizing function.
 */
export default function useLocalizedPath() {
  const context = useContext(I18nContext)
  if (!context) throw Error('Cannot fetch the current i18n context, is the corresponding provider instated?')

  return context.state.getLocalizedPath ?? ((path: string) => path)
}
