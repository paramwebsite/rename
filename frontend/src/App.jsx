import React from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import HomePage from './pages/HomePage'
import PageNotFound from './pages/PageNotFound'



import Display1 from './pages/App_1/Display1'
import Display2 from './pages/App_2/Display2'
import Display3 from './pages/App_3/Display3'
import Display4 from './pages/App_4/Display4'
import Display5 from './pages/App_5/Display5'
import Display6 from './pages/App_6/Display6'
import Display7 from './pages/App_7/Display7'
import Display8 from './pages/App_8/Display8'
import Display9 from './pages/App_9/Display9'
import Display10 from './pages/App_10/Display10'

import Display12 from './pages/App_12/Display12'
import Display11 from './pages/App_11/Display11'



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
        <Route path='/display6' element={<Display6/>} />
        <Route path='/display7' element={<Display7/>} />
        <Route path='/display8' element={<Display8/>} />
        <Route path='/display9' element={<Display9/>} />
        <Route path='/display10' element={<Display10/>} />
        <Route path='/display11' element={<Display11/>} />
        <Route path='/display12' element={<Display12/>} />
        <Route path='*' element={<PageNotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
