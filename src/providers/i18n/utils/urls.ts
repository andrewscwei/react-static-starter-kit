type URLParts = {
  base?: string
  hash?: string
  host?: string
  path?: string
  port?: string
  protocol?: string
  query?: string
}

type ResolveLocaleOptions = {
  /**
   * The locale to fallback to if one cannot be inferred from the provided URL.
   */
  defaultLocale?: string

  /**
   * An array of supported locales to validate the inferred locale against. If it doesn't exist in
   * the list of supported locales, the default locale (if specified) or `undefined` will be
   * returned.
   */
  supportedLocales?: string[]
}

type ResolveLocalizedURLOptions = ResolveLocaleOptions & {
  /**
   * Specifies where in the URL the locale should be matched. If `resolver` is provided, this option
   * is ignored.
   */
  resolveStrategy?: 'auto' | 'domain' | 'path' | 'query'

  /**
   * Custom resolver function.
   *
   * @param protocol - The matched protocol of the provided url, if available.
   * @param host - The matched host of the provided url, if available.
   * @param port - The matched port of the provided url, if available.
   * @param path - The matched path of the provided url, if available.
   *
   * @returns The resolved locale.
   */
  resolver?: (urlParts: URLParts) => string | undefined
}

type LocalizedURLInfo = {
  /**
   * The matched locale.
   */
  locale: string

  /**
   * Specifies where in the URL the locale was matched.
   */
  resolveStrategy: ResolveLocalizedURLOptions['resolveStrategy'] | 'custom'
}

/**
 * Parses a URL into parts.
 *
 * @param url - The URL to parse.
 *
 * @returns The parsed result.
 */
function parseURL(url: string): URLParts {
  const regex = /((?:(.*):\/\/)?((?:[A-Za-z0-9-]+\.?)+)?(?::([0-9]+))?)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/
  const parts = url.match(regex)

  if (!parts) return {}

  return {
    base: parts[1],
    hash: parts[7],
    host: parts[3],
    path: parts[5],
    port: parts[4],
    protocol: parts[2],
    query: parts[6],
  }
}

/**
 * Constructs a URL from {@link URLParts}.
 *
 * @param parts - See {@link URLParts}.
 *
 * @returns The constructed URL.
 */
function constructURL(parts: URLParts): string {
  const protocol = parts.protocol?.concat('://') ?? ''
  const host = parts.host?.concat('/') ?? ''
  const port = parts.port ? `:${parts.port}` : ''
  const path = parts.path ? `/${parts.path.split('/').filter(t => t).join('/')}` : ''
  const query = parts.query ? `?${parts.query}` : ''
  const hash = parts.hash ? `#${parts.hash}` : ''

  return `${protocol}${host}${port}${path}${query}${hash}`
}

/**
 * Resolves the specified locale with the provided options. All parameters are optional.
 *
 * @param locale - The locale to resolve.
 * @param options - See {@link ResolveLocaleOptions}.
 *
 * @returns - The resolved locale.
 */
function resolveLocale(locale?: string, { defaultLocale, supportedLocales }: ResolveLocaleOptions = {}): string | undefined {
  if (supportedLocales) {
    if (locale && supportedLocales.indexOf(locale) >= 0) return locale
    if (defaultLocale && supportedLocales.indexOf(defaultLocale) >= 0) return defaultLocale

    return undefined
  }

  return locale ?? defaultLocale
}

/**
 * Retrieves the locale identifier from a URL. The default behavior of this function to look for the
 * locale identifier in the domain first followed by the first directory of the path. You can
 * provide a custom resolver.
 *
 * @param url - The URL, can be a full URL or a valid path.
 * @param options - See {@link ResolveLocalizedURLOptions}.
 *
 * @returns The inferred locale if it exists.
 */
export function getLocaleFromURL(url: string, { defaultLocale, resolveStrategy = 'auto', resolver, supportedLocales }: ResolveLocalizedURLOptions = {}): LocalizedURLInfo | undefined {
  const parts = parseURL(url)

  if (resolver) {
    const matchedLocale = resolver(parts)

    if (matchedLocale && (!supportedLocales || supportedLocales.indexOf(matchedLocale) >= 0)) return { locale: matchedLocale, resolveStrategy: 'custom' }
    if (defaultLocale && (!supportedLocales || supportedLocales.indexOf(defaultLocale) >= 0)) return { locale: defaultLocale, resolveStrategy: 'auto' }

    return undefined
  }
  else {
    const matchedLocaleFromHost = parts.host?.split('.').filter(t => t)[0]
    const matchedLocaleFromPath = parts.path?.split('/').filter(t => t)[0]
    const matchedLocaleFromQuery = new URLSearchParams(parts.query).get('locale')

    if (matchedLocaleFromHost && (resolveStrategy === 'auto' || resolveStrategy === 'domain') && (!supportedLocales || supportedLocales.indexOf(matchedLocaleFromHost) >= 0)) return { locale: matchedLocaleFromHost, resolveStrategy: 'domain' }
    if (matchedLocaleFromPath && (resolveStrategy === 'auto' || resolveStrategy === 'path') && (!supportedLocales || supportedLocales.indexOf(matchedLocaleFromPath) >= 0)) return { locale: matchedLocaleFromPath, resolveStrategy: 'path' }
    if (matchedLocaleFromQuery && (resolveStrategy === 'auto' || resolveStrategy === 'query') && (!supportedLocales || supportedLocales.indexOf(matchedLocaleFromQuery) >= 0)) return { locale: matchedLocaleFromQuery, resolveStrategy: 'query' }
    if (defaultLocale && (!supportedLocales || supportedLocales.indexOf(defaultLocale) >= 0)) return { locale: defaultLocale, resolveStrategy: 'auto' }

    return undefined
  }
}

/**
 * Returns the unlocalized version of a URL.
 *
 * @param url - The URL.
 * @param options - See {@link ResolveLocalizedURLOptions}.
 *
 * @returns The unlocalized URL.
 */
export function getUnlocalizedURL(url: string, { resolveStrategy = 'auto', resolver, supportedLocales }: ResolveLocalizedURLOptions): string {
  const currLocaleInfo = getLocaleFromURL(url, { resolveStrategy, resolver, supportedLocales })
  const parts = parseURL(url)

  if (!currLocaleInfo) return url

  switch (currLocaleInfo.resolveStrategy) {
    case 'domain':
      return constructURL({ ...parts, host: parts.host ? parts.host.split('.').filter(t => t).slice(1).join('.') : undefined })
    case 'query': {
      if (!parts.query) return url

      const searchParams = new URLSearchParams(parts.query)
      searchParams.delete('locale')

      return constructURL({ ...parts, query: searchParams.toString() })
    }
    case 'path':
    case 'auto':
    default:
      return constructURL({ ...parts, path: parts.path ? [...parts.path.split('/').filter(t => t).slice(1)].join('/') : undefined })
  }
}

/**
 * Returns the localized version of a URL.
 *
 * @param url - The URL.
 * @param locale - The target locale.
 * @param options - See {@link ResolveLocalizedURLOptions}.
 *
 * @returns The localized URL.
 */
export function getLocalizedURL(url: string, locale: string, { defaultLocale, resolveStrategy = 'auto', resolver, supportedLocales }: ResolveLocalizedURLOptions = {}): string {
  const currLocaleInfo = getLocaleFromURL(url, { resolveStrategy, resolver, supportedLocales })
  const parts = parseURL(url)
  const targetLocale = resolveLocale(locale, { defaultLocale, supportedLocales })

  if (!targetLocale) return url

  if (targetLocale === defaultLocale) return getUnlocalizedURL(url, { resolveStrategy, resolver, supportedLocales })

  if (currLocaleInfo) {
    switch (currLocaleInfo.resolveStrategy) {
      case 'domain':
        return constructURL({ ...parts, host: parts.host ? `${targetLocale}.${parts.host.split('.').filter(t => t).slice(1).join('.')}` : undefined })
      case 'query': {
        if (!parts.query) return url

        const searchParams = new URLSearchParams(parts.query)
        if (searchParams.get('locale')) {
          searchParams.set('locale', targetLocale)
        }
        else {
          searchParams.set('locale', targetLocale)
        }

        return constructURL({ ...parts, query: searchParams.toString() })
      }
      case 'path':
      case 'auto':
      default:
        return constructURL({ ...parts, path: parts.path ? [targetLocale, ...parts.path.split('/').filter(t => t).slice(1)].join('/') : undefined })
    }
  }
  else {
    switch (resolveStrategy) {
      case 'domain':
        return constructURL({ ...parts, host: parts.host ? `${targetLocale}.${parts.host}` : undefined })
      case 'query': {
        const searchParams = new URLSearchParams(parts.query)

        if (targetLocale === defaultLocale) {
          searchParams.delete('locale')
        }
        else {
          searchParams.set('locale', targetLocale)
        }

        return constructURL({ ...parts, query: searchParams.toString() })
      }
      case 'path':
      case 'auto':
      default:
        return constructURL({ ...parts, path: parts.path ? [targetLocale, ...parts.path.split('/').filter(t => t)].join('/') : undefined })
    }
  }
}

/**
 * Returns all localized versions of a URL based on the specified `supportedLocales`.
 *
 * @param url - The URL.
 * @param options - See {@link ResolveLocalizedURLOptions}.
 *
 * @returns The localized URLs.
 */
export function getLocalizedURLs(url: string, { defaultLocale, resolveStrategy = 'auto', resolver, supportedLocales }: ResolveLocalizedURLOptions = {}): string[] {
  if (!supportedLocales) return []

  return supportedLocales.map(locale => getLocalizedURL(url, locale, { defaultLocale, resolveStrategy, resolver, supportedLocales }))
}
