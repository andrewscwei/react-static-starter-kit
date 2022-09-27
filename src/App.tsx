import React from 'react'
import { Route, Routes } from 'react-router'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './containers/Home'
import NotFound from './containers/NotFound'
import About from './containers/Quote'
import { QuoteProvider } from './providers/quotes'

export default function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='quote' element={<QuoteProvider><About/></QuoteProvider>}/>
        <Route path='ja' element={<Home/>}/>
        <Route path='ja/quote' element={<QuoteProvider><About/></QuoteProvider>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Footer/>
    </>
  )
}
