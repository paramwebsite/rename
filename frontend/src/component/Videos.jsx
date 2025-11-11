import React from 'react'
import VideoUpload from './VideoUpload'
import VideoList from './VideoList'


const Videos = () => {
  return (
    <div className='flex flex-col gap-2'>
        <VideoUpload />
        <VideoList/>
    </div>
  )
}

export default Videos
