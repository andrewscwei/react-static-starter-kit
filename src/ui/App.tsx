import React, { StrictMode, Suspense, lazy } from 'react'
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { useFavicon, useThemeColor } from '../../lib/dom'
import { I18nProvider, I18nRoutes } from '../../lib/i18n'
import { BASE_PATH, DEFAULT_LOCALE, LOCALE_CHANGE_STRATEGY, MASK_ICON_COLOR, PUBLIC_PATH, THEME_COLOR } from '../app.conf'
import translations from '../locales'
import './styles/global.css'
import './styles/theme.css'

const Footer = lazy(() => import('./components/Footer'))
const Header = lazy(() => import('./components/Header'))
const Home = lazy(() => import('./pages/home'))
const NotFound = lazy(() => import('./pages/notFound'))
const Quote = lazy(() => import('./pages/quote'))

export default function App() {
  useThemeColor(THEME_COLOR)

  useFavicon({
    maskIcon: {
      color: MASK_ICON_COLOR,
    },
    icon: {
      darkImage: `${PUBLIC_PATH}favicon-dark.svg`,
    },
    alternateIcon: {
      darkImage: `${PUBLIC_PATH}favicon-dark.png`,
    },
  })

  return (
    <StrictMode>
      <BrowserRouter basename={BASE_PATH}>
        <I18nProvider defaultLocale={DEFAULT_LOCALE} translations={translations} localeChangeStrategy={LOCALE_CHANGE_STRATEGY}>
          <Suspense>
            <Header/>
          </Suspense>
          <Suspense>
            <I18nRoutes>
              <Route index element={<Home/>}/>
              <Route path='quote' element={<Quote/>}/>
              <Route path='*' element={<NotFound/>}/>
            </I18nRoutes>
          </Suspense>
          <Suspense>
            <Footer/>
          </Suspense>
        </I18nProvider>
      </BrowserRouter>
    </StrictMode>
  )
}
