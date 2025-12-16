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
        <Link className='block mb-3' to="/display5">Display5</Link>
        <Link className='block mb-3' to="/display6">Display6</Link>
        <Link className='block mb-3' to="/display7">Display7</Link>
        <Link className='block mb-3' to="/display8">Display8</Link>
        <Link className='block mb-3' to="/display9">Display9</Link>
        <Link className='block mb-3' to="/display10">Display10</Link>
        <Link className='block mb-3' to="/display11">Display11</Link>
        <Link className='block mb-3' to="/display12">Display12</Link>

    </div>
  )
}

export default HomePage
