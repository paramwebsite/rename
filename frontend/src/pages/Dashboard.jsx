// import React, { useEffect, useState } from 'react'
// import Videos from '../component/Videos'
// import Dipslays from '../component/Dipslays'
// import VideoToDisplay from '../component/VideoToDisplay'
// import { API_URL } from '../utils/config'
// import axios from 'axios'
// import { io, Socket } from 'socket.io-client'



// const socket = io(API_URL);

// const Dashboard = () => {
//     const [name, setName] = useState('');
//     const [message, setMesaage] = useState('');



//     const handleNameSubmit = async () => {

//         if (!name.trim()) {
//             setMesaage("Display Name Can't be Empty");

//             setTimeout(() => {
//                 setMesaage('');
//             }, 4000);


//             return;
//         }



//         const res = await axios.post(`${API_URL}/name`, {
//             name
//         });

//         console.log(res.data);



//     }


//     useEffect(() => {

//         socket.emit('RegisterDashboard', 1);


//     })

//     const onNameChange = (e) => {
//         setName(e.target.value);
//         // const nameText = e.target.value;
//         // socket.emit("NameInput", { nameText })
//     }






//     return (
//         <div className='w-full h-full   flex flex-col'>

//             <h1 className='text-center text-2xl font-bold p-4  '>Reinvent Your name </h1>


//             <div className="flex flex-col gap-14 min-h-screen ">
//                 <div className=" bg-white shadow-lg  p-6 w-full ">

//                     <div className="flex flex-col gap-4">
//                         {/* Input field */}
//                         <div className="flex flex-col">
//                             <label
//                                 htmlFor="DisplayName"
//                                 className="mb-1 text-sm font-medium text-gray-700"
//                             >
//                                 Enter your Name
//                             </label>
//                             <input
//                                 id="DisplayName"
//                                 type="text"
//                                 className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                                 placeholder="Enter Your name"
//                                 value={name}
//                                 // onChange={(e) => setName(e.target.value)}
//                                 onChange={onNameChange}
//                             />
//                             <p className='text-red-500'>{message}</p>
//                         </div>

//                         {/* Button */}
//                         <button
//                             onClick={handleNameSubmit}
//                             className=" w-28 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
//                         >
//                             Submit
//                         </button>
//                     </div>
//                 </div>




//             </div>




//         </div>







//     )
// }

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import Videos from "../component/Videos";
// import Dipslays from "../component/Dipslays";
// import VideoToDisplay from "../component/VideoToDisplay";
// import { API_URL } from "../utils/config";           // ✅ re-enable
// import axios from "axios";
// import { getSocket } from "../utils/socket";

// const Dashboard = () => {
//   const socket = useMemo(() => getSocket(), []);
//   const [stationId, setStationId] = useState("rename"); // must match RFID station id from reader
//   const [uid, setUid] = useState("");
//   const [name, setName] = useState("");
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState("Place your RFID card to begin…");
//   const [phase, setPhase] = useState("idle"); // idle | form | submitted
//   const timeoutRef = useRef(null);

//   // register dashboard once
//   useEffect(() => {
//     socket.emit("RegisterDashboard", 1);
//     // ❌ don't disconnect the singleton here—just remove listeners in other effect
//   }, [socket]);

//   // RFID events from unified backend
//   useEffect(() => {
//     const onDetected = (data) => {
//       if (!data || data.stationId !== stationId) return;
//       clearTimeout(timeoutRef.current);
//       setUid(data.UID);
//       setStatus(`Card detected: ${data.UID}`);
//       setPhase("form");                 // 👈 only now show the name input
//       timeoutRef.current = setTimeout(() => {
//         setStatus("⏱ Session timed out. Remove and reinsert card.");
//         setPhase("idle");
//         setUid("");
//         setName("");
//         socket.emit("ClearDisplays");
//       }, 60_000);
//     };

//     const onLifted = (data) => {
//       if (!data || data.stationId !== stationId) return;
//       clearTimeout(timeoutRef.current);
//       setStatus("Card lifted. Back to start.");
//       setPhase("idle");                 // 👈 hides the name input again
//       setUid("");
//       setName("");
//       socket.emit("ClearDisplays");
//     };

//     socket.on("card-detected", onDetected);
//     socket.on("card-lifted", onLifted);

//     return () => {
//       socket.off("card-detected", onDetected);
//       socket.off("card-lifted", onLifted);
//       clearTimeout(timeoutRef.current);
//     };
//   }, [socket, stationId]);

//   const onNameChange = (e) => setName(e.target.value);

//   // helper: save name-only to /visitors/data (no file)
//   const saveNameOnly = async () => {
//     const fd = new FormData();
//     fd.append("UID", uid);
//     fd.append("stationId", stationId);
//     fd.append("name", name.trim());
//     const res = await fetch(`${API_URL}/visitors/data`, {
//       method: "POST",
//       body: fd,
//     });
//     if (!res.ok) {
//       const data = await res.json().catch(() => ({}));
//       throw new Error(data?.error || "Failed to save name");
//     }
//     return res.json();
//   };

//   const handleNameSubmit = async () => {
//     if (!uid) {
//       setMessage("Please place your RFID card first.");
//       setTimeout(() => setMessage(""), 3000);
//       return;
//     }
//     if (!name.trim()) {
//       setMessage("Display Name can't be empty");
//       setTimeout(() => setMessage(""), 3000);
//       return;
//     }

//     socket.emit("NameInput", { nameText: name.trim() }); // fan out to displays

//     // optional: keep your /name HTTP route
//     // try {
//     //   await axios.post(`${API_URL}/name`, { name: name.trim() });
//     // } catch (e) {
//     //   console.warn("POST /name failed (socket still sent):", e?.message);
//     // }
//     // 2) persist name-only (no image yet) using the SAME endpoint as snapshot
//     try {
//       await saveNameOnly(); // emits "visitor-updated" (name only)
//     } catch (e) {
//       console.warn("POST /visitors/data (name-only) failed:", e?.message);
//       // We still proceed since displays already got the name via socket
//     }

//     setStatus("✅ Name sent to displays. Waiting for card lift…");
//     setPhase("submitted");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && phase === "form") {
//       e.preventDefault();
//       handleNameSubmit();
//     }
//   };

//   // Dev helpers (simulate RFID)
//   const simulateInsert = async () => {
//     const simulatedUID = "03 4F 68 56";
//     await fetch(`${API_URL}/events/add_event`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ UID: simulatedUID, stationId, eventType: "cardDetected" }),
//     });
//   };
//   const simulateRemove = async () => {
//     if (!uid) return;
//     await fetch(`${API_URL}/events/add_event`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ UID: uid, stationId, eventType: "cardLifted" }),
//     });
//   };

//   return (
//     <div className="w-full h-full flex flex-col">
//       <h1 className="text-center text-2xl font-bold p-4">Reinvent Your Name</h1>

//       <div className="flex flex-col gap-14 min-h-screen">
//         {/* RFID Gate Card */}
//         <div className="bg-white shadow-lg p-6 w-full">
//           <div className="flex flex-col gap-4">
//             {/* Status + Station */}
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//               <p className="text-sm text-gray-700">
//                 <span className="font-semibold">Status:</span> {status}
//               </p>
//               <label className="text-sm text-gray-600">
//                 Station ID:&nbsp;
//                 <input
//                   className="border border-gray-300 rounded-lg px-2 py-1"
//                   value={stationId}
//                   onChange={(e) => setStationId(e.target.value)}
//                   placeholder="station id"
//                 />
//               </label>
//             </div>

//             {/* Idle (place card) */}
//             {phase === "idle" && (
//               <div className="border border-dashed border-gray-300 rounded-lg p-4">
//                 <p className="text-gray-700">Place your RFID card to begin…</p>
//                 <button
//                   onClick={simulateInsert}
//                   className="mt-3 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
//                 >
//                   Simulate Card Insert
//                 </button>
//               </div>
//             )}

//             {/* Form (only visible when a card is present) */}
//             {phase === "form" && (
//               <div className="flex flex-col gap-3">
//                 <div className="flex flex-col">
//                   <label className="mb-1 text-sm font-medium text-gray-700">UID</label>
//                   <input
//                     value={uid}
//                     readOnly
//                     className="border border-gray-300 rounded-lg p-2 bg-gray-50"
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="DisplayName"
//                     className="mb-1 text-sm font-medium text-gray-700"
//                   >
//                     Enter your Name
//                   </label>
//                   <input
//                     id="DisplayName"
//                     type="text"
//                     onKeyDown={handleKeyDown}
//                     className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     placeholder="Enter your name"
//                     value={name}
//                     onChange={onNameChange}
//                     autoFocus
//                   />
//                   {message && <p className="text-red-500">{message}</p>}
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={handleNameSubmit}
//                     disabled={name.trim().length === 0}
//                     className={`w-28 text-white font-medium py-2 rounded-lg transition ${name.trim().length === 0
//                         ? "bg-blue-300 cursor-not-allowed"
//                         : "bg-blue-600 hover:bg-blue-700"
//                       }`}
//                   >
//                     Submit
//                   </button>
//                   <button
//                     onClick={simulateRemove}
//                     className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
//                   >
//                     Simulate Card Remove
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Submitted (waiting for lift) */}
//             {phase === "submitted" && (
//               <div className="border rounded-lg p-4">
//                 <p className="text-gray-700">
//                   Name sent to displays. Please lift the card to reset.
//                 </p>
//                 <button
//                   onClick={simulateRemove}
//                   className="mt-3 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
//                 >
//                   Simulate Card Remove
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Existing panels
//         <div className="bg-white shadow-lg p-6 w-full">
//           <Dipslays />
//         </div> */}

//         {/* <div className="bg-white shadow-lg p-6 w-full">
//           <VideoToDisplay />
//         </div> */}

//         {/* <div className="bg-white shadow-lg p-6 w-full">
//           <Videos /> */}
//         {/* </div> */}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// import React, { useEffect, useMemo, useRef, useState } from "react";
// import Videos from "../component/Videos";
// import Dipslays from "../component/Dipslays";
// import VideoToDisplay from "../component/VideoToDisplay";
// import { API_URL } from "../utils/config";
// import axios from "axios";
// import { getSocket } from "../utils/socket";

// const Dashboard = () => {
//   const socket = useMemo(() => getSocket(), []);
//   const [stationId, setStationId] = useState("rename"); // must match RFID station id from reader
//   const [uid, setUid] = useState("");
//   const [name, setName] = useState("");
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState("Place your RFID card to begin…");
//   const [phase, setPhase] = useState("idle"); // idle | form | submitted
//   const timeoutRef = useRef(null);

//   // NEW: typed UID for simulation
//   const [simUID, setSimUID] = useState("");

//   useEffect(() => {
//     socket.emit("RegisterDashboard", 1);
//   }, [socket]);

//   useEffect(() => {
//     const onDetected = (data) => {
//       if (!data || data.stationId !== stationId) return;
//       clearTimeout(timeoutRef.current);
//       setUid(data.UID);
//       setStatus(`Card detected: ${data.UID}`);
//       setPhase("form");
//       timeoutRef.current = setTimeout(() => {
//         setStatus("⏱ Session timed out. Remove and reinsert card.");
//         setPhase("idle");
//         setUid("");
//         setName("");
//         socket.emit("ClearDisplays");
//       }, 60_000);
//     };

//     const onLifted = (data) => {
//       if (!data || data.stationId !== stationId) return;
//       clearTimeout(timeoutRef.current);
//       setStatus("Card lifted. Back to start.");
//       setPhase("idle");
//       setUid("");
//       setName("");
//       socket.emit("ClearDisplays");
//     };

//     socket.on("card-detected", onDetected);
//     socket.on("card-lifted", onLifted);
//     return () => {
//       socket.off("card-detected", onDetected);
//       socket.off("card-lifted", onLifted);
//       clearTimeout(timeoutRef.current);
//     };
//   }, [socket, stationId]);

//   const onNameChange = (e) => setName(e.target.value);

//   // save name via same endpoint (no image yet)
//   const saveNameOnly = async () => {
//     const fd = new FormData();
//     fd.append("UID", uid);
//     fd.append("stationId", stationId);
//     fd.append("name", name.trim());
//     await fetch(`${API_URL}/visitors/data`, { method: "POST", body: fd });
//   };

//   const handleNameSubmit = async () => {
//     if (!uid) {
//       setMessage("Please place your RFID card first.");
//       setTimeout(() => setMessage(""), 3000);
//       return;
//     }
//     if (!name.trim()) {
//       setMessage("Display Name can't be empty");
//       setTimeout(() => setMessage(""), 3000);
//       return;
//     }
//     socket.emit("NameInput", { nameText: name.trim() });
//     try { await saveNameOnly(); } catch (e) { console.warn(e?.message); }
//     setStatus("✅ Name sent to displays. Waiting for card lift…");
//     setPhase("submitted");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && phase === "form") {
//       e.preventDefault();
//       handleNameSubmit();
//     }
//   };

//   // SIMULATION HELPERS (now using typed UID)
//   const simulateInsert = async () => {
//     const entered = simUID.trim();
//     if (!entered) {
//       setMessage("Enter a UID to simulate.");
//       setTimeout(() => setMessage(""), 2500);
//       return;
//     }
//     await fetch(`${API_URL}/events/add_event`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ UID: entered, stationId, eventType: "cardDetected" }),
//     });
//   };

//   const simulateRemove = async () => {
//     if (!uid) return;
//     await fetch(`${API_URL}/events/add_event`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ UID: uid, stationId, eventType: "cardLifted" }),
//     });
//   };

//   return (
//     <div className="w-full h-full flex flex-col">
//       <h1 className="text-center text-2xl font-bold p-4">Reinvent Your Name</h1>

//       <div className="flex flex-col gap-14 min-h-screen">
//         {/* RFID Gate Card */}
//         <div className="bg-white shadow-lg p-6 w-full">
//           <div className="flex flex-col gap-4">
//             {/* Status + Station */}
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//               <p className="text-sm text-gray-700">
//                 <span className="font-semibold">Status:</span> {status}
//               </p>
//               <label className="text-sm text-gray-600">
//                 Station ID:&nbsp;
//                 <input
//                   className="border border-gray-300 rounded-lg px-2 py-1"
//                   value={stationId}
//                   onChange={(e) => setStationId(e.target.value)}
//                   placeholder="station id"
//                 />
//               </label>
//             </div>

//             {/* Idle (place card) */}
//             {phase === "idle" && (
//               <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
//                 <p className="text-gray-700">Place your RFID card to begin…</p>

//                 {/* NEW: Type a UID for simulation */}
//                 <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
//                   <input
//                     className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
//                     value={simUID}
//                     onChange={(e) => setSimUID(e.target.value)}
//                     placeholder="Enter UID to simulate (e.g. 03 4F 68 56)"
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") simulateInsert();
//                     }}
//                   />
//                   <button
//                     onClick={simulateInsert}
//                     className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
//                   >
//                     Simulate Card Insert
//                   </button>
//                 </div>

//                 {message && <p className="text-red-500">{message}</p>}
//               </div>
//             )}

//             {/* Form (only visible when a card is present) */}
//             {phase === "form" && (
//               <div className="flex flex-col gap-3">
//                 <div className="flex flex-col">
//                   <label className="mb-1 text-sm font-medium text-gray-700">UID</label>
//                   <input
//                     value={uid}
//                     readOnly
//                     className="border border-gray-300 rounded-lg p-2 bg-gray-50"
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label htmlFor="DisplayName" className="mb-1 text-sm font-medium text-gray-700">
//                     Enter your Name
//                   </label>
//                   <input
//                     id="DisplayName"
//                     type="text"
//                     onKeyDown={handleKeyDown}
//                     className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     placeholder="Enter your name"
//                     value={name}
//                     onChange={onNameChange}
//                     autoFocus
//                   />
//                   {message && <p className="text-red-500">{message}</p>}
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={handleNameSubmit}
//                     disabled={name.trim().length === 0}
//                     className={`w-28 text-white font-medium py-2 rounded-lg transition ${
//                       name.trim().length === 0
//                         ? "bg-blue-300 cursor-not-allowed"
//                         : "bg-blue-600 hover:bg-blue-700"
//                     }`}
//                   >
//                     Submit
//                   </button>
//                   <button
//                     onClick={simulateRemove}
//                     className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
//                   >
//                     Simulate Card Remove
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Submitted (waiting for lift) */}
//             {phase === "submitted" && (
//               <div className="border rounded-lg p-4">
//                 <p className="text-gray-700">
//                   Name sent to displays. Please lift the card to reset.
//                 </p>
//                 <button
//                   onClick={simulateRemove}
//                   className="mt-3 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
//                 >
//                   Simulate Card Remove
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* (Optional) Keep the panels if you want them visible here */}
//         {/* <div className="bg-white shadow-lg p-6 w-full"><Dipslays /></div>
//         <div className="bg-white shadow-lg p-6 w-full"><VideoToDisplay /></div>
//         <div className="bg-white shadow-lg p-6 w-full"><Videos /></div> */}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useMemo, useRef, useState } from "react";
import Videos from "../component/Videos";
import Dipslays from "../component/Dipslays";
import VideoToDisplay from "../component/VideoToDisplay";
import { API_URL } from "../utils/config";
import { getWS, sendJSON } from "../utils/ws";
import { authenticateUID } from "../utils/auth";   // ⬅️ NEW

const Dashboard = () => {
  const ws = useMemo(() => getWS(), []);
  const [stationId, setStationId] = useState("rename"); // must match RFID station id from reader
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Place your RFID card to begin…");
  const [phase, setPhase] = useState("idle"); // idle | form | submitted
  const timeoutRef = useRef(null);

  // typed UID for simulation
  const [simUID, setSimUID] = useState("");

  // useEffect(() => {
  //   socket.emit("RegisterDashboard", 1);
  // }, [socket]);

  useEffect(() => {
    const onOpen = () => {
      sendJSON(ws, { type: "registerDashboard", dashboardId: 1 });
    };

    if (ws.readyState === WebSocket.OPEN) onOpen();
    else ws.addEventListener("open", onOpen);

    return () => ws.removeEventListener("open", onOpen);
  }, [ws]);

  // useEffect(() => {
  //   const onDetected = (data) => {
  //     if (!data || data.stationId !== stationId) return;

  //     // ✅ Verify authorization before proceeding (defense-in-depth)
  //     // const auth = await authenticateUID(API_URL, data.UID);
  //     // if (!auth.ok) {
  //     //   setStatus(`❌ ${auth.body?.message || "Authorization failed"} (${auth.status})`);
  //     //   setPhase("idle");
  //     //   return;
  //     // }

  //     clearTimeout(timeoutRef.current);
  //     setUid(data.UID);
  //     setStatus(`Card detected: ${data.UID}`);
  //     setPhase("form");

  //     timeoutRef.current = setTimeout(() => {
  //       setStatus("⏱ Session timed out. Remove and reinsert card.");
  //       setPhase("idle");
  //       setUid("");
  //       setName("");
  //       socket.emit("ClearDisplays");
  //     }, 60_000);
  //   };

  //   const onLifted = (data) => {
  //     if (!data || data.stationId !== stationId) return;
  //     clearTimeout(timeoutRef.current);
  //     setStatus("Card lifted. Back to start.");
  //     setPhase("idle");
  //     setUid("");
  //     setName("");
  //     socket.emit("ClearDisplays");
  //   };

  //   // socket.on("card-detected", onDetected);
  //   // socket.on("card-lifted", onLifted);


  //   return () => {
  //     socket.off("card-detected", onDetected);
  //     socket.off("card-lifted", onLifted);
  //     clearTimeout(timeoutRef.current);
  //   };
  // }, [socket, stationId]);

  useEffect(() => {
    const onMessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }

      // card detected
      if (msg.type === "card-detected") {
        if (msg.stationId !== stationId) return;

        clearTimeout(timeoutRef.current);
        setUid(msg.UID);
        setStatus(`Card detected: ${msg.UID}`);
        setPhase("form");

        timeoutRef.current = setTimeout(() => {
          setStatus("⏱ Session timed out. Remove and reinsert card.");
          setPhase("idle");
          setUid("");
          setName("");
          sendJSON(ws, { type: "ClearDisplays" });
        }, 180_000);
      }

      // card lifted
      if (msg.type === "card-lifted") {
        if (msg.stationId !== stationId) return;

        clearTimeout(timeoutRef.current);
        setStatus("Card lifted. Back to start.");
        setPhase("idle");
        setUid("");
        setName("");
        sendJSON(ws, { type: "ClearDisplays" });
      }
    };

    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("message", onMessage);
      clearTimeout(timeoutRef.current);
    };
  }, [ws, stationId]);

  const onNameChange = (e) => setName(e.target.value);

  // save name via same endpoint (no image yet)
  const saveNameOnly = async () => {
    const fd = new FormData();
    fd.append("UID", uid);
    fd.append("stationId", stationId);
    fd.append("name", name.trim());
    await fetch(`${API_URL}/visitors/data`, { method: "POST", body: fd });
  };

  const handleNameSubmit = async () => {
    if (!uid) {
      setMessage("Please place your RFID card first.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (!name.trim()) {
      setMessage("Display Name can't be empty");
      setTimeout(() => setMessage(""), 3000);
      return;
    }


    //socket.emit("NameInput", { nameText: name.trim() });
    sendJSON(ws, { type: "NameInput", nameText: name.trim() });

    try { await saveNameOnly(); } catch (e) { console.warn(e?.message); }
    setStatus("✅ Name sent to displays. Waiting for card lift…");
    setPhase("submitted");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && phase === "form") {
      e.preventDefault();
      handleNameSubmit();
    }
  };

  // SIMULATION HELPERS (auth first, then post event)
  const simulateInsert = async () => {
    const entered = simUID.trim();
    if (!entered) {
      setMessage("Enter a UID to simulate.");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    // 1) AUTH FIRST
    const auth = await authenticateUID(API_URL, entered);
    if (!auth.ok) {
      setStatus(`❌ ${auth.body?.message || "Authorization failed"} (${auth.status})`);
      setPhase("idle");
      return; // ⛔ do NOT post /events/add_event
    }

    // 2) AUTH OK → post cardDetected
    await fetch(`${API_URL}/events/add_event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UID: entered, stationId, eventType: "cardDetected" }),
    });
  };

  const simulateRemove = async () => {
    if (!uid) return;
    await fetch(`${API_URL}/events/add_event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UID: uid, stationId, eventType: "cardLifted" }),
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-center text-2xl font-bold p-4">Reinvent Your Name</h1>

      <div className="flex flex-col gap-14 min-h-screen">
        {/* RFID Gate Card */}
        <div className="bg-white shadow-lg p-6 w-full">
          <div className="flex flex-col gap-4">
            {/* Status + Station */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Status:</span> {status}
              </p>
              <label className="text-sm text-gray-600">
                Station ID:&nbsp;
                <input
                  className="border border-gray-300 rounded-lg px-2 py-1"
                  value={stationId}
                  onChange={(e) => setStationId(e.target.value)}
                  placeholder="station id"
                />
              </label>
            </div>

            {/* Idle (place card) */}
            {phase === "idle" && (
              <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                <p className="text-gray-700">Place your RFID card to begin…</p>

                {/* Type a UID for simulation */}
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <input
                    className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
                    value={simUID}
                    onChange={(e) => setSimUID(e.target.value)}
                    placeholder="Enter UID to simulate (e.g. 03 4F 68 56)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") simulateInsert();
                    }}
                  />
                  <button
                    onClick={simulateInsert}
                    className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Simulate Card Insert
                  </button>
                </div>

                {message && <p className="text-red-500">{message}</p>}
              </div>
            )}

            {/* Form (only visible when a card is present) */}
            {phase === "form" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700">UID</label>
                  <input
                    value={uid}
                    readOnly
                    className="border border-gray-300 rounded-lg p-2 bg-gray-50"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="DisplayName" className="mb-1 text-sm font-medium text-gray-700">
                    Enter your Name
                  </label>
                  <input
                    id="DisplayName"
                    type="text"
                    onKeyDown={handleKeyDown}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your name"
                    value={name}
                    onChange={onNameChange}
                    autoFocus
                  />
                  {message && <p className="text-red-500">{message}</p>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNameSubmit}
                    disabled={name.trim().length === 0}
                    className={`w-28 text-white font-medium py-2 rounded-lg transition ${name.trim().length === 0
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    Submit
                  </button>
                  <button
                    onClick={simulateRemove}
                    className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Simulate Card Remove
                  </button>
                </div>
              </div>
            )}

            {/* Submitted (waiting for lift) */}
            {phase === "submitted" && (
              <div className="border rounded-lg p-4">
                <p className="text-gray-700">
                  Name sent to displays. Please lift the card to reset.
                </p>
                <button
                  onClick={simulateRemove}
                  className="mt-3 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Simulate Card Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Optional panels */}
        {/* <div className="bg-white shadow-lg p-6 w-full"><Dipslays /></div>
        <div className="bg-white shadow-lg p-6 w-full"><VideoToDisplay /></div>
        <div className="bg-white shadow-lg p-6 w-full"><Videos /></div> */}
      </div>
    </div>
  );
};

export default Dashboard;
