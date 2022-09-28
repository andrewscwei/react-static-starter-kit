import React from 'react'
import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './containers/Home'
import NotFound from './containers/NotFound'
import Quote from './containers/Quote'
import translations from './locales'
import { I18nRouterProvider } from './providers/i18n'
import { QuoteProvider } from './providers/quotes'
import './styles/global.css'

export default function App() {
  const defaultLocale = 'en'
  const locales = Object.keys(translations)

  return (
    <BrowserRouter>
      <I18nRouterProvider defaultLocale={defaultLocale} translations={translations}>
        <Header/>
        <Routes>
          {locales.map(locale => (
            <Route key={locale} path={locale === defaultLocale ? '/' : locale}>
              <Route index element={<Home/>}/>
              <Route path='quote' element={<QuoteProvider><Quote/></QuoteProvider>}/>
            </Route>
          ))}
          <Route path='*' element={<NotFound/>}/>
        </Routes>
        <Footer/>
      </I18nRouterProvider>
    </BrowserRouter>
  )
}
