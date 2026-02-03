import React from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import HomePage from './pages/HomePage'
import PageNotFound from './pages/PageNotFound'
import Display4 from './pages/App_4/Display4'
import Display8 from './pages/App_8/Display8'
import Display10 from './pages/App_10/Display10'


import Display1 from './pages/Display1'
import Display5 from './pages/Display5'
import Display6 from './pages/Display6'
import Display7 from './pages/Display7'
import Display2 from './pages/Display2'
import Display9 from './pages/Display9'
import Display11 from './pages/Display11'
import Display12 from './pages/Display12'
import Display_3 from './pages/App_3/Display_3'


const App = () => {
  return (


   
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/display1' element={<Display1/>} />
        <Route path='/display2' element={<Display2/>} />
        <Route path='/display3' element={<Display_3/>} />
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
