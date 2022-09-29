import React from 'react'
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './containers/Home'
import NotFound from './containers/NotFound'
import Quote from './containers/Quote'
import translations from './locales'
import I18nRouterProvider, { I18nRoutes } from './providers/i18n/I18nRouterProvider'
import { QuoteProvider } from './providers/quotes'
import './styles/global.css'

export default function App() {
  return (
    <BrowserRouter>
      <I18nRouterProvider defaultLocale={'en'} translations={translations}>
        <Header/>
        <I18nRoutes>
          <Route index element={<Home/>}/>
          <Route path='quote' element={<QuoteProvider><Quote/></QuoteProvider>}/>
          <Route path='*' element={<NotFound/>}/>
        </I18nRoutes>
        <Footer/>
      </I18nRouterProvider>
    </BrowserRouter>
  )
}
