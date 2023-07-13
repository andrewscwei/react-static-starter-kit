import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import appConf from './app.conf'
import I18nProvider, { I18nRoutes } from './base/providers/I18nProvider'
import Footer from './components/Footer'
import Header from './components/Header'
import translations from './locales'
import Home from './pages/home'
import NotFound from './pages/notFound'
import Quote from './pages/quote'
import './styles/global.css'
import './styles/theme.css'

export default function App() {
  return (
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter basename={appConf.basePath}>
          <I18nProvider defaultLocale={appConf.defaultLocale} translations={translations} changeLocaleStrategy='path'>
            <Header/>
            <I18nRoutes>
              <Route index element={<Home/>}/>
              <Route path='quote' element={<Quote/>}/>
              <Route path='*' element={<NotFound/>}/>
            </I18nRoutes>
            <Footer/>
          </I18nProvider>
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  )
}
