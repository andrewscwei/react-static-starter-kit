import React from 'react'
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import translations from './locales'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Quote from './pages/Quote'
import I18nRouterProvider, { I18nRoutes } from './providers/i18n/I18nRouterProvider'
import './styles/global.css'

export default function App() {
  return (
    <BrowserRouter>
      <I18nRouterProvider defaultLocale={'en'} translations={translations}>
        <Header/>
        <I18nRoutes>
          <Route index element={<Home/>}/>
          <Route path='quote' element={<Quote/>}/>
          <Route path='*' element={<NotFound/>}/>
        </I18nRoutes>
        <Footer/>
      </I18nRouterProvider>
    </BrowserRouter>
  )
}
