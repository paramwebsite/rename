import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
        <p className=' text-center'>Home page</p>


        <Link className='block mb-3' to="/dashboard">Dashboard</Link>
        <Link className='block mb-3' to="/display1">Display1</Link>
        <Link className='block mb-3' to="/display2">Display2</Link>
        <Link className='block mb-3' to="/display3">Display3</Link>
        <Link className='block mb-3' to="/display4">Display4</Link>

    </div>
  )
}

export default HomePage
