import React from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import HomePage from './pages/HomePage'
import PageNotFound from './pages/PageNotFound'
import Display4 from './pages/App_4/Display4'
import Display8 from './pages/App_8/Display8'
import Display10 from './pages/App_10/Display10'



import Display6 from './pages/Display6'
import Display7 from './pages/Display7'
import Display2 from './pages/Display2'
import Display11 from './pages/Display11'
import Display12 from './pages/Display12'
import Display_3 from './pages/App_3/Display_3'
import Display_1 from './pages/App_1/Display_1'
import Display_9 from './pages/App_9/Display_9'
import Display_5 from './pages/App_5/Display_5'



const App = () => {
  return (


   
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/display1' element={<Display_1/>} />
        <Route path='/display2' element={<Display2/>} />
        <Route path='/display3' element={<Display_3/>} />
        <Route path='/display4' element={<Display4/>} />
        <Route path='/display5' element={<Display_5/>} />
        <Route path='/display6' element={<Display6/>} />
        <Route path='/display7' element={<Display7/>} />
        <Route path='/display8' element={<Display8/>} />
        <Route path='/display9' element={<Display_9/>} />
        <Route path='/display10' element={<Display10/>} />
        <Route path='/display11' element={<Display11/>} />
        <Route path='/display12' element={<Display12/>} />
        <Route path='*' element={<PageNotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
