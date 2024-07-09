import { createRoot, hydrateRoot } from 'react-dom/client'
import { type RouteObject } from 'react-router'
import { generateLocalizedRoutes, type I18nConfig } from '../i18n'
import { createDebug } from '../utils/createDebug'
import { loadLazyComponents } from './loadLazyComponents'
import { type RenderProps } from './types'

type Config = {
  /**
   * ID of the DOM element to render the application root in. in.
   */
  containerId?: string

  /**
   * Specifies whether to hydrate the application root.
   */
  hydrate?: boolean

  /**
   * Configuration for i18n (see {@link I18nConfig}).
   */
  i18n: I18nConfig

  /**
   * Configuration for routes (see {@link RouteObject}).
   */
  routes: RouteObject[]
}

const debug = createDebug(undefined, 'app')

/**
 * Initializes the client application.
 *
 * @param render Render function for the application.
 * @param config Additional configurations, see {@link Config}.
 *
 * @returns The application root.
 */
export async function initClient(render: (props: RenderProps) => JSX.Element, {
  containerId = 'root',
  hydrate = false,
  i18n,
  routes,
}: Config) {
  const localizedRoutes = generateLocalizedRoutes(routes, i18n)
  const container = window.document.getElementById(containerId ?? 'root')

  if (!container) throw console.warn(`No container with ID <${containerId}> found`)

  await loadLazyComponents(localizedRoutes)

  const app = render({ routes: localizedRoutes })

  if (hydrate) {
    hydrateRoot(container, app)
  }
  else {
    createRoot(container).render(app)
  }

  debug('Initializing client...', 'OK')
}
