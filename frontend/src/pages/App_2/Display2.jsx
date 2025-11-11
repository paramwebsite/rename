import React from 'react'
import { API_URL, WS_URL } from "../../utils/config";
import { Layout } from './components/Layout';
import { SpellerMachine } from './components/SpellerMachine';



const displayId = 2;





const Display2 = () => {

 

  






  return (
    <Layout>
      <div className="min-h-screen bg-[#0A1A2A] text-white">
        <div className="container mx-auto py-4 sm:py-6 lg:py-8">
          <header className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Periodic Speller</h1>
            <p className="text-lg sm:text-xl opacity-90">Discover the elements in your words!</p>
          </header>
          
          <main>
            <SpellerMachine displayId={displayId} />
          </main>
        </div>
      </div>
    </Layout>
  )
}

export default Display2
