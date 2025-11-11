// import React, { useCallback, useEffect, useState } from 'react'
// import { io } from "socket.io-client";
// import { API_URL, WS_URL } from "../../utils/config";
// import { LetterImage } from './component/LetterImage';
// import lettersData from './data/letters.json';



// const DEFAULT_NAME = 'PARAM';
// const INACTIVITY_TIMEOUT = 45000; // 45 seconds
// const PAGE_INACTIVITY_TIMEOUT = 90000; // 90 seconds
// const MAX_CHARS = 25;

// const displayId = 1;

// const Display1 = () => {




//   const [showStart, setShowStart] = useState(true);
//   const [name, setName] = useState('');
//   const [displayName, setDisplayName] = useState('');
//   const [selectedLetters, setSelectedLetters] = useState([]);
//   const [error, setError] = useState('');
//   const [lastActivity, setLastActivity] = useState(Date.now());
//   const [lastPageActivity, setLastPageActivity] = useState(Date.now());
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [isNSFW, setIsNSFW] = useState(false);

//   const getRandomLetterData = useCallback((letter, data) => {
//     if (letter === ' ') return null;
//     const letterOptions = data[letter];
//     if (!letterOptions) return null;
//     return letterOptions[Math.floor(Math.random() * letterOptions.length)];
//   }, []);



//   const generateLettersForName = useCallback((inputName) => {
//     const letters = inputName.toUpperCase().split('');
//     const invalidLetters = letters.filter(letter => letter !== ' ' && !lettersData[letter]);

//     if (invalidLetters.length > 0) {
//       setError("Some characters in your name are not available in the Landsat database.");
//       return null;
//     }

//     return letters.map(letter => getRandomLetterData(letter, lettersData));
//   }, [getRandomLetterData]);



//   const handleSubmit = (name) => {

//     console.log("inside handlesubmit", name);
//     const newLetters = generateLettersForName(name);

//     console.log("handleSubmit:", newLetters);
//     if (newLetters) {
//       setSelectedLetters(newLetters);
//       setDisplayName(name);
//       setLastActivity(Date.now());
//       setLastPageActivity(Date.now());
//       setIsInitialLoad(false);
//     }
//   };


//   const resetToDefault = useCallback(() => {
//     setName('');
//     const defaultLetters = generateLettersForName(DEFAULT_NAME);
//     if (defaultLetters) {
//       setSelectedLetters(defaultLetters);
//       setDisplayName(DEFAULT_NAME);
//       setIsInitialLoad(true);
//     }
//   }, [generateLettersForName]);

//   useEffect(() => {
//     resetToDefault();
//   }, [resetToDefault]);




//   useEffect(() => {
//     // connect socket
//     const socket = io(API_URL);

//     // register this display
//     socket.emit("registerDisplay", displayId);

//     socket.on("newName", (data) => {
//       console.log("Received new name:", data.name);
//       setName(data.name);
//       handleSubmit(data.name);
//     });

//     return () => socket.disconnect();
//   }, [])

//   useEffect(() => {
//     console.log("selectedLetters:", selectedLetters);
//   }, [selectedLetters])











//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0B1026] via-[#1B2A4A] to-[#162B46]">
//       <div className="star-field" />
//       <div className="container relative mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-12 animate-fadeIn">
//           <div className="inline-flex items-center justify-center gap-4 mb-6">
//             {/* <Satellite className="w-12 h-12 text-blue-400 animate-float" /> */}
//             {/* <Globe2 className="w-16 h-16 text-blue-300 animate-float" style={{ animationDelay: '1s' }} /> */}
//             {/* <Rocket className="w-12 h-12 text-blue-400 animate-float" style={{ animationDelay: '2s' }} /> */}
//           </div>
//           <div className="flex items-center justify-center gap-4 mb-6">
//             <h1 className="text-6xl leading-[3] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-100 to-blue-300">
//               India's Sky Signature
//             </h1>

//           </div>
//           <p className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed">
//             Experience India's beauty from space as your name comes to life through carefully curated Landsat satellite imagery
//           </p>
//         </div>

//         {/* Image Display */}
//         <div className="mb-12 relative">
//           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B2A4A]/50 to-transparent pointer-events-none" />
//           <div className="flex flex-wrap justify-center gap-2">
//             {selectedLetters.map((letterData, index) => (
//               letterData ? (


//                 <LetterImage
//                   key={`${displayName}-${index}`}
//                   data={letterData}
//                   totalLetters={selectedLetters.length}
//                   index={index}
//                 />



//               ) : (
//                 <LetterImage
//                   key={`${displayName}-space-${index}`}
//                   data={{
//                     location: '',
//                     coordinates: '',
//                     image: ''
//                   }}
//                   totalLetters={selectedLetters.length}
//                   index={index}
//                   isSpace={true}
//                 />
//               )
//             ))}


//           </div>
//         </div>


//       </div>
//     </div>
//   )
// }

// export default Display1

import React, { useCallback, useEffect, useState } from "react";
// import { io } from "socket.io-client";
import { API_URL } from "../../utils/config";
import { getSocket } from "../../utils/socket";
import { LetterImage } from "./component/LetterImage";
import lettersData from "./data/letters.json";


const DEFAULT_NAME = "PARAM";
const MAX_CHARS = 25;
const displayId = 1;

const Display1 = () => {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [error, setError] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const getRandomLetterData = useCallback((letter, data) => {
    if (letter === " ") return null;
    const letterOptions = data[letter];
    if (!letterOptions) return null;
    return letterOptions[Math.floor(Math.random() * letterOptions.length)];
  }, []);

  const generateLettersForName = useCallback(
    (inputName) => {
      const letters = inputName.toUpperCase().slice(0, MAX_CHARS).split("");
      const invalidLetters = letters.filter(
        (letter) => letter !== " " && !lettersData[letter]
      );
      if (invalidLetters.length > 0) {
        setError(
          "Some characters in your name are not available in the Landsat database."
        );
        return null;
      }
      return letters.map((letter) => getRandomLetterData(letter, lettersData));
    },
    [getRandomLetterData]
  );

  const handleSubmit = useCallback(
    (incomingName) => {
      const newLetters = generateLettersForName(incomingName);
      if (newLetters) {
        setSelectedLetters(newLetters);
        setDisplayName(incomingName);
        setIsInitialLoad(false);
      }
    },
    [generateLettersForName]
  );

  const resetToDefault = useCallback(() => {
    setName("");
    const defaultLetters = generateLettersForName(DEFAULT_NAME);
    if (defaultLetters) {
      setSelectedLetters(defaultLetters);
      setDisplayName(DEFAULT_NAME);
      setIsInitialLoad(true);
      setError("");
    }
  }, [generateLettersForName]);

  useEffect(() => {
    resetToDefault();
  }, [resetToDefault]);

  useEffect(() => {
    // one socket to unified server
    // const socket = io(API_URL, { transports: ["websocket"] });
    const socket = getSocket();
    // register this display
    socket.emit("registerDisplay", displayId);

    const onNewName = (data) => {
      if (!data?.name) return;
      setName(data.name);
      handleSubmit(data.name);
    };

    const onReset = () => {
      resetToDefault();
    };

    socket.on("newName", onNewName);
    socket.on("resetDisplay", onReset);

    return () => {
      socket.off("newName", onNewName);
      socket.off("resetDisplay", onReset);
      // socket.disconnect();
    };
  }, [handleSubmit, resetToDefault]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0B1026] via-[#1B2A4A] to-[#162B46]">
      <div className="star-field" />
      <div className="container relative mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-6xl leading-[3] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-100 to-blue-300">
              India's Sky Signature
            </h1>
          </div>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Experience India's beauty from space as your name comes to life
            through carefully curated Landsat satellite imagery
          </p>
          {error && (
            <p className="mt-3 text-red-400 text-sm max-w-2xl mx-auto">
              {error}
            </p>
          )}
        </div>

        {/* Image Display */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B2A4A]/50 to-transparent pointer-events-none" />
          <div className="flex flex-wrap justify-center gap-2">
            {selectedLetters.map((letterData, index) =>
              letterData ? (
                <LetterImage
                  key={`${displayName}-${index}`}
                  data={letterData}
                  totalLetters={selectedLetters.length}
                  index={index}
                />
              ) : (
                <LetterImage
                  key={`${displayName}-space-${index}`}
                  data={{ location: "", coordinates: "", image: "" }}
                  totalLetters={selectedLetters.length}
                  index={index}
                  isSpace
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display1;
