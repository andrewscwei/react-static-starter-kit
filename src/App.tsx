import React from 'react'
import { Route, useLocation } from 'react-router'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './containers/Home'
import NotFound from './containers/NotFound'
import Quote from './containers/Quote'
import useScrollToTop from './hooks/useScrollToTop'
import { I18nRoutes } from './providers/i18n/I18nRouterProvider'
import { QuoteProvider } from './providers/quotes'
import './styles/global.css'

export default function App() {
  useScrollToTop([useLocation()])

  return (
    <>
      <Header/>
      <I18nRoutes>
        <Route index element={<Home/>}/>
        <Route path='quote' element={<QuoteProvider><Quote/></QuoteProvider>}/>
        <Route path='*' element={<NotFound/>}/>
      </I18nRoutes>
      <Footer/>
    </>
  )
}
