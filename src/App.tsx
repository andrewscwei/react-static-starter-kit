/**
 * @file Client app root.
 */

import React from 'react'
import { Route, Routes } from 'react-router'
import Footer from './components/Footer'
import Header from './components/Header'
import About from './containers/About'
import Home from './containers/Home'
import NotFound from './containers/NotFound'

export default function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='about' element={<About/>}/>
        <Route path='ja' element={<Home/>}/>
        <Route path='ja/about' element={<About/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Footer/>
    </>
  )
}
