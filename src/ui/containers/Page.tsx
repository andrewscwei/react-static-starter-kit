import { BASE_URL } from '@/app.config.js'
import { Footer } from '@/ui/components/Footer.js'
import { useI18n } from '@lib/i18n'
import { useMeta, type Metadata } from '@lib/meta'
import { type PropsWithChildren } from 'react'
import { useLocation } from 'react-router'

type Props = PropsWithChildren<{
  metadata?: Metadata
}>

export function Page({
  children,
  metadata = {},
}: Props) {
  const { locale, t } = useI18n()
  const location = useLocation()

  useMeta({
    canonicalURL: BASE_URL ? BASE_URL + location.pathname : undefined,
    description: t('description'),
    locale,
    ...metadata,
  })

  return (
    <>
      {children}
      <Footer/>
    </>
  )
}
