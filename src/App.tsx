import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import appConf from './app.conf'
import Footer from './components/Footer'
import Header from './components/Header'
import translations from './locales'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Quote from './pages/Quote'
import I18nProvider, { I18nRoutes } from './providers/I18nProvider'
import './styles/global.css'
import useDebug from './utils/useDebug'

const debug = useDebug()

export function mount(containerId = 'app') {
  const container = document.getElementById(containerId)
  if (!container) return console.warn(`No container with ID <${containerId}> found`)

  const app = <App/>

  createRoot(container).render(app)

  debug('Mounting app...', 'OK')
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <I18nProvider defaultLocale={appConf.defaultLocale} translations={translations} changeLocaleStrategy='action'>
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
  )
}
