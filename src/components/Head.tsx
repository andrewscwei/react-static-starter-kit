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
      <meta charSet='utf-8'/>
      <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
      <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover'/>
      <meta name='theme-color' content='#000'/>

      <link rel='canonical' href={pageUrl}/>
      <link rel='mask-icon' href={assets.meta.PinnedIcon} color='#000'/>
      <link rel='alternate icon' type='image/png' href={assets.meta.AltFavicon}/>
      <link rel='icon' href={assets.meta.Favicon}/>

      <title>{pageTitle}</title>
      <meta name='description' content={pageDescription}/>

      <meta property='og:site_name' content={baseTitle}/>
      <meta property='og:title' content={pageTitle}/>
      <meta property='og:description' content={pageDescription}/>
      <meta property='og:locale' content={locale}/>
      <meta property='og:url' content={pageUrl}/>
      <meta property='og:type' content='website'/>
      <meta property='og:image' content={baseUrl + assets.meta.OGImage}/>
      <meta property='og:image:alt' content={pageDescription}/>

      <meta name='twitter:title' content={pageTitle}/>
      <meta name='twitter:description' content={pageDescription}/>
      <meta name='twitter:image' content={baseUrl + assets.meta.TwitterCard}/>
      <meta name='twitter:card' content='summary_large_image'/>

      <meta name='mobile-web-app-capable' content='yes'/>
      <meta name='apple-mobile-web-app-capable' content='yes'/>
      <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
      <meta name='apple-mobile-web-app-title' content={baseTitle}/>
      <link rel='apple-touch-icon' href={assets.meta.AltFavicon} sizes='57x57'/>
      <link rel='apple-touch-icon' href={assets.meta.AltFavicon} sizes='60x60'/>
      <link rel='apple-touch-icon' href={assets.meta.AltFavicon} sizes='72x72'/>
      <link rel='apple-touch-icon' href={assets.meta.AltFavicon} sizes='76x76'/>
      <link rel='apple-touch-icon' href={assets.meta.AltFavicon} sizes='114x114'/>
      <link rel='apple-touch-icon' href={assets.meta.AltFavicon} sizes='120x120'/>
      <link rel='apple-touch-icon' href={assets.meta.AltFavicon} sizes='144x144'/>
      <link rel='apple-touch-icon' href={assets.meta.AltFavicon} sizes='152x152'/>
      <link rel='apple-touch-icon' href={assets.meta.AltFavicon} sizes='180x180'/>
      <link rel='apple-touch-icon' href={assets.meta.AltFavicon} sizes='192x192'/>
      <link rel='manifest' href='/manifest.json'/>
    </Helmet>
  )
}
