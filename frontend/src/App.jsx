import React from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import HomePage from './pages/HomePage'
import PageNotFound from './pages/PageNotFound'
import Display1 from './pages/App_1/Display1'
import Display2 from './pages/App_2/Display2'
import Display3 from './pages/App_3/Display3'


import Display4 from './pages/Display4'
import Display5 from './pages/Display5'

const App = () => {
  return (


   
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/display1' element={<Display1/>} />
        <Route path='/display2' element={<Display2/>} />
        <Route path='/display3' element={<Display3/>} />
        <Route path='/display4' element={<Display4/>} />
        <Route path='/display5' element={<Display5/>} />
        <Route path='*' element={<PageNotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
