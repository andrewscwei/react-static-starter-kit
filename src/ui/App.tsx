import React, { StrictMode, Suspense, lazy } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { BASE_PATH, DEFAULT_LOCALE } from '../app.conf'
import I18nProvider, { I18nRoutes } from '../base/providers/I18nProvider'
import translations from '../locales'
import './styles/global.css'
import './styles/theme.css'

const Footer = lazy(() => import('./components/Footer'))
const Header = lazy(() => import('./components/Header'))
const Home = lazy(() => import('./pages/home'))
const NotFound = lazy(() => import('./pages/notFound'))
const Quote = lazy(() => import('./pages/quote'))

export default function App() {
  return (
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter basename={BASE_PATH}>
          <I18nProvider defaultLocale={DEFAULT_LOCALE} translations={translations} changeLocaleStrategy='path'>
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
      </HelmetProvider>
    </StrictMode>
  )
}
