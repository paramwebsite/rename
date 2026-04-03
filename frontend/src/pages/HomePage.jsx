import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
        <p className=' text-center'>Home page</p>


        <Link className='block mb-3' to="/dashboard">Dashboard</Link>
        <Link className='block mb-3' to="/display1">Display_1: Formula</Link>
        <Link className='block mb-3' to="/display2">Display_2: zizan-font</Link>
        <Link className='block mb-3' to="/display3">Display_3: map</Link>
        <Link className='block mb-3' to="/display4">Display_4: geography</Link>
        <Link className='block mb-3' to="/display5">Display_5: count</Link>
        <Link className='block mb-3' to="/display6">Display_6: codes</Link>
        <Link className='block mb-3' to="/display7">Display_7: text-animation</Link>
        <Link className='block mb-3' to="/display8">Display_8: chemistry</Link>
        <Link className='block mb-3' to="/display9">Display_9: egyptian</Link>
        <Link className='block mb-3' to="/display10">Display_10: language</Link>
        <Link className='block mb-3' to="/display11">Display_11: formula</Link>
        <Link className='block mb-3' to="/display12">Display_12: gen-ai</Link>

    </div>
  )
}

export default HomePage
