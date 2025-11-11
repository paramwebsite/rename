import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import { API_URL, WS_URL } from "../utils/config";


const displayId = 5;

const Display5 = () => {

  const [name, setName] = useState('');
 
 
 
 
   useEffect(() => {
     // loadVideoName();
 
     // connect socket
     const socket = io(API_URL);
 
     // register this display
     socket.emit("registerDisplay", displayId);
 
 
     socket.on("newName", (data) => {
       console.log("Received new name:", data.name);
 
       setName(data.name);
     });
 
 
 
     return () => socket.disconnect();
 
 
   }, [])
 
 
   return (
     <div className="h-screen w-screen bg-[#fff5f5] ">
 
           <p className=' text-center text-2xl capitalize font-semibold bg-[#ffdeeb] py-5'>Display Name: Display-{displayId}</p>
       <div className='max-w-7xl  mx-auto pt-10'>
 
 
      
        
           <h1 className=' text-center text-2xl capitalize font-semibold'>Name: {name}</h1>
  
 
 
 
         <img id="myImage" src="http://localhost:4000/images/myphoto.jpeg" alt="Uploaded" className='mx-auto  w-[50%]  object-contain' />
 
       </div>
 
 
     </div>
   )
}

export default Display5
