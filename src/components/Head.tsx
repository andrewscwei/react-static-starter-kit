import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'
import * as assets from '../assets'
import { useLocale } from '../providers/i18n'

type Props = {
  description?: string
  title?: string
}

export default function Head({
  description,
  title,
}: Props) {
  const { title: baseTitle, description: baseDescription, url: baseUrl } = __CONFIG__.meta
  const pageTitle = title ?? baseTitle
  const pageDescription = description ?? baseDescription
  const pageUrl = baseUrl + useLocation().pathname
  const locale = useLocale()

  return (
    <Helmet>
      <link rel='canonical' href={pageUrl}/>
      <link rel='mask-icon' href={assets.meta.PinnedIcon} color='#000' type='image/svg+xml'/>
      <link rel='alternate icon' type='image/png' href={assets.meta.AltFaviconDark} media='(prefers-color-scheme: dark)'/>
      <link rel='alternate icon' type='image/png' href={assets.meta.AltFaviconLight} media='(prefers-color-scheme: light)'/>
      <title>{pageTitle}</title>
      <meta name='description' content={pageDescription}/>

      <meta property='og:site_name' content={baseTitle}/>
      <meta property='og:title' content={pageTitle}/>
      <meta property='og:description' content={pageDescription}/>
      <meta property='og:locale' content={locale}/>
      <meta property='og:url' content={pageUrl}/>
      <meta property='og:image' content={baseUrl + assets.meta.OGImage}/>
      <meta property='og:image:alt' content={pageDescription}/>

      <meta name='twitter:title' content={pageTitle}/>
      <meta name='twitter:description' content={pageDescription}/>
      <meta name='twitter:image' content={baseUrl + assets.meta.TwitterCard}/>

      <meta name='apple-mobile-web-app-title' content={baseTitle}/>
    </Helmet>
  )
}
