// // import React, { useEffect, useRef, useState } from 'react'
// // import { io } from "socket.io-client";
// // import { API_URL, WS_URL } from "../../utils/config";
// // import Card from "./components/Card"
// // import "./styles.css";


// // const displayId = 3;







// // const LANGS = [
// //   { label: "Hindi (Devanagari)", itc: "hi-t-i0-und", code: "hi" },
// //   { label: "Marathi (Devanagari)", itc: "mr-t-i0-und", code: "mr" },
// //   { label: "Sanskrit (Devanagari)", itc: "sa-t-i0-und", code: "sa" },
// //   { label: "Nepali (Devanagari)", itc: "ne-t-i0-und", code: "ne" },
// //   { label: "Bengali", itc: "bn-t-i0-und", code: "bn" },
// //   { label: "Assamese", itc: "as-t-i0-und", code: "as" },
// //   { label: "Gujarati", itc: "gu-t-i0-und", code: "gu" },
// //   { label: "Punjabi (Gurmukhi)", itc: "pa-t-i0-und", code: "pa" },
// //   { label: "Odia", itc: "or-t-i0-und", code: "or" },
// //   { label: "Tamil", itc: "ta-t-i0-und", code: "ta" },
// //   { label: "Telugu", itc: "te-t-i0-und", code: "te" },
// //   { label: "Kannada", itc: "kn-t-i0-und", code: "kn" },
// //   { label: "Malayalam", itc: "ml-t-i0-und", code: "ml" },
// // ];

// // const COLORS = [
// //   { bg: "#FFB3B3", text: "#400" },
// //   { bg: "#FFD699", text: "#442200" },
// //   { bg: "#B3E6B3", text: "#003300" },
// //   { bg: "#99D6FF", text: "#00334D" },
// //   { bg: "#D9B3FF", text: "#33004D" },
// //   { bg: "#FFB3E6", text: "#4D0033" },
// //   { bg: "#FFE699", text: "#4D3B00" },
// //   { bg: "#B3FFD9", text: "#00331F" },
// //   { bg: "#C2C2F0", text: "#1A0033" },
// //   { bg: "#FF9999", text: "#330000" },
// //   { bg: "#FFCC99", text: "#331A00" },
// //   { bg: "#B3FFB3", text: "#003300" },
// //   { bg: "#99CCFF", text: "#001A33" },
// // ];

// // const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// // function buildUrl(text, itc) {
// //   const base = "https://inputtools.google.com/request";
// //   const q = new URLSearchParams({
// //     text,
// //     itc,
// //     num: "5",
// //     cp: "0",
// //     cs: "1",
// //     ie: "utf-8",
// //     oe: "utf-8",
// //     app: "demopage",
// //   });
// //   return `${base}?${q.toString()}`;
// // }

// // async function fetchWithTimeout(resource, options = {}) {
// //   const { timeout = 8000 } = options;
// //   const controller = new AbortController();
// //   const id = setTimeout(() => controller.abort(), timeout);
// //   try {
// //     const response = await fetch(resource, { signal: controller.signal });
// //     return response;
// //   } finally {
// //     clearTimeout(id);
// //   }
// // }

// // async function tryTransliterate(text, itc) {
// //   const url = buildUrl(text, itc);
// //   const tryFetch = async (target) => {
// //     const r = await fetchWithTimeout(target);
// //     if (r.ok) {
// //       const data = await r.json();
// //       const cand = data?.[1]?.[0]?.[1]?.[0];
// //       if (data?.[0] === "SUCCESS" && cand) return cand;
// //     }
// //   };
// //   try {
// //     return (
// //       (await tryFetch(url)) ||
// //       (await tryFetch(
// //         `https://r.jina.ai/http://inputtools.google.com/request?${url.split("?")[1]}`
// //       )) ||
// //       (await tryFetch(`https://cors.isomorphic-git.org/${url}`)) ||
// //       "—"
// //     );
// //   } catch {
// //     return "—";
// //   }
// // }

// // const Display3 = () => {




// //   useEffect(() => {
// //     // loadVideoName();

// //     // connect socket
// //     const socket = io(API_URL);

// //     // register this display
// //     socket.emit("registerDisplay", displayId);


// //     socket.on("newName", (data) => {
// //       console.log("Received new name:", data.name);

// //       setText(data.name);
// //     });



// //     return () => socket.disconnect();


// //   }, [])



// //   const [text,setText] = useState("Param");
// //   const [results, setResults] = useState([]);
// //   const [active, setActive] = useState([]);

// //   // Persistent layout
// //   const repeatedLangsRef = useRef([]);
// //   if (repeatedLangsRef.current.length === 0) {
// //     repeatedLangsRef.current = Array.from({ length: 300 }, (_, i) => {
// //       const base = randomItem(LANGS);
// //       const color = randomItem(COLORS);
// //       const sizeType = randomItem(["small", "medium", "large"]);
// //       // ~70% initially active
// //       const initialActive = Math.random() > 0.3;
// //       return { ...base, color, sizeType, id: i, initialActive };
// //     });
// //   }

// //   // Fetch transliterations
// //   useEffect(() => {
// //     if (!text) return;
// //     (async () => {
// //       const out = [];
// //       await Promise.all(
// //         LANGS.map(async (l) => {
// //           const value = await tryTransliterate(text, l.itc);
// //           out.push({ ...l, value });
// //         })
// //       );
// //       setResults(out);
// //     })();
// //   }, [text]);

// //   // Continuous flicker — always a mix of active/inactive
// //   useEffect(() => {
// //     const total = repeatedLangsRef.current.length;
// //     let current = repeatedLangsRef.current.map((r) => r.initialActive);
// //     setActive(current);

// //     const flicker = () => {
// //       const temp = [...current];

// //       // randomly toggle ~15–25 cells
// //       const numToToggle = 15 + Math.floor(Math.random() * 10);
// //       const indices = new Set();
// //       while (indices.size < numToToggle) {
// //         indices.add(Math.floor(Math.random() * total));
// //       }
// //       indices.forEach((i) => (temp[i] = !temp[i]));

// //       current = temp;
// //       setActive(temp);
// //       setTimeout(flicker, 1000); // continuous, overlapping
// //     };

// //     flicker();
// //   }, []);

// //   const repeatedLangs = repeatedLangsRef.current;

// //   return (
// //     <div
// //       style={{
// //         width: "100vw",
// //         height: "100vh",
// //         background: "#111",
// //         overflow: "hidden",
// //         padding: "10px",
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //       }}
// //     >
// //       <div
// //         style={{
// //           display: "flex",
// //           flexWrap: "wrap",
// //           gap: "6px",
// //           justifyContent: "center",
// //           alignContent: "flex-start",
// //           width: "100%",
// //           height: "100%",
// //         }}
// //       >
// //         {repeatedLangs.map((r, i) => {
// //           const translit =
// //             results.find((res) => res.code === r.code)?.value ||
// //             text ||
// //             "…";
// //           return (
// //             <Card
// //               key={r.id}
// //               lang={r.label}
// //               value={translit}
// //               color={r.color}
// //               active={active[i]}
// //               sizeType={r.sizeType}
// //             />
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // }

// // export default Display3
// import React, { useEffect, useRef, useState } from "react";
// import Card from "./components/Card";
// import "./styles.css";
// import { getWS } from "../../utils/ws"; // ⬅️ singleton socket (see utils/socket.js)

// const displayId = 10;

// const LANGS = [
//   { label: "Hindi (Devanagari)", itc: "hi-t-i0-und", code: "hi" },
//   { label: "Marathi (Devanagari)", itc: "mr-t-i0-und", code: "mr" },
//   { label: "Sanskrit (Devanagari)", itc: "sa-t-i0-und", code: "sa" },
//   { label: "Nepali (Devanagari)", itc: "ne-t-i0-und", code: "ne" },
//   { label: "Bengali", itc: "bn-t-i0-und", code: "bn" },
//   { label: "Assamese", itc: "as-t-i0-und", code: "as" },
//   { label: "Gujarati", itc: "gu-t-i0-und", code: "gu" },
//   { label: "Punjabi (Gurmukhi)", itc: "pa-t-i0-und", code: "pa" },
//   { label: "Odia", itc: "or-t-i0-und", code: "or" },
//   { label: "Tamil", itc: "ta-t-i0-und", code: "ta" },
//   { label: "Telugu", itc: "te-t-i0-und", code: "te" },
//   { label: "Kannada", itc: "kn-t-i0-und", code: "kn" },
//   { label: "Malayalam", itc: "ml-t-i0-und", code: "ml" },
// ];

// const COLORS = [
//   { bg: "#FFB3B3", text: "#400" },
//   { bg: "#FFD699", text: "#442200" },
//   { bg: "#B3E6B3", text: "#003300" },
//   { bg: "#99D6FF", text: "#00334D" },
//   { bg: "#D9B3FF", text: "#33004D" },
//   { bg: "#FFB3E6", text: "#4D0033" },
//   { bg: "#FFE699", text: "#4D3B00" },
//   { bg: "#B3FFD9", text: "#00331F" },
//   { bg: "#C2C2F0", text: "#1A0033" },
//   { bg: "#FF9999", text: "#330000" },
//   { bg: "#FFCC99", text: "#331A00" },
//   { bg: "#B3FFB3", text: "#003300" },
//   { bg: "#99CCFF", text: "#001A33" },
// ];

// const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// function buildUrl(text, itc) {
//   const base = "https://inputtools.google.com/request";
//   const q = new URLSearchParams({
//     text,
//     itc,
//     num: "5",
//     cp: "0",
//     cs: "1",
//     ie: "utf-8",
//     oe: "utf-8",
//     app: "demopage",
//   });
//   return `${base}?${q.toString()}`;
// }

// async function fetchWithTimeout(resource, options = {}) {
//   const { timeout = 8000 } = options;
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeout);
//   try {
//     const response = await fetch(resource, { signal: controller.signal });
//     return response;
//   } finally {
//     clearTimeout(id);
//   }
// }

// async function tryTransliterate(text, itc) {
//   const url = buildUrl(text, itc);
//   const tryFetch = async (target) => {
//     const r = await fetchWithTimeout(target);
//     if (r.ok) {
//       const data = await r.json();
//       const cand = data?.[1]?.[0]?.[1]?.[0];
//       if (data?.[0] === "SUCCESS" && cand) return cand;
//     }
//   };
//   try {
//     return (
//       (await tryFetch(url)) ||
//       (await tryFetch(
//         `https://r.jina.ai/http://inputtools.google.com/request?${url.split("?")[1]}`
//       )) ||
//       (await tryFetch(`https://cors.isomorphic-git.org/${url}`)) ||
//       "—"
//     );
//   } catch {
//     return "—";
//   }
// }

// const Display10 = () => {
//   const [text, setText] = useState("Param");
//   const [results, setResults] = useState([]);
//   const [active, setActive] = useState([]);

//   // persistent layout
//   const repeatedLangsRef = useRef([]);
//   if (repeatedLangsRef.current.length === 0) {
//     repeatedLangsRef.current = Array.from({ length: 300 }, (_, i) => {
//       const base = randomItem(LANGS);
//       const color = randomItem(COLORS);
//       const sizeType = randomItem(["small", "medium", "large"]);
//       const initialActive = Math.random() > 0.3; // ~70% active
//       return { ...base, color, sizeType, id: i, initialActive };
//     });
//   }

//   // socket: register + listeners
//   useEffect(() => {
//     const socket = getSocket();

//     socket.emit("registerDisplay", `display-${displayId}`);

//     const onNewName = (data) => {
//       if (!data?.name) return;
//       setText(data.name);
//     };

//     const onReset = () => {
//       setText("Param");   // default
//       setResults([]);     // clear rendered transliterations
//       // keep the flicker going; layout stays persistent
//     };

//     socket.on("newName", onNewName);
//     socket.on("resetDisplay", onReset);

//     return () => {
//       socket.off("newName", onNewName);
//       socket.off("resetDisplay", onReset);
//       // don't disconnect the singleton
//     };
//   }, []);

//   // fetch transliterations whenever text changes
//   useEffect(() => {
//     let cancelled = false;
//     if (!text) return;

//     (async () => {
//       const out = [];
//       await Promise.all(
//         LANGS.map(async (l) => {
//           const value = await tryTransliterate(text, l.itc);
//           out.push({ ...l, value });
//         })
//       );
//       if (!cancelled) setResults(out);
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [text]);

//   // continuous flicker
//   useEffect(() => {
//     const total = repeatedLangsRef.current.length;
//     let current = repeatedLangsRef.current.map((r) => r.initialActive);
//     setActive(current);

//     let cancelled = false;
//     const flicker = () => {
//       if (cancelled) return;
//       const temp = [...current];
//       const numToToggle = 15 + Math.floor(Math.random() * 10);
//       const indices = new Set();
//       while (indices.size < numToToggle) {
//         indices.add(Math.floor(Math.random() * total));
//       }
//       indices.forEach((i) => (temp[i] = !temp[i]));
//       current = temp;
//       setActive(temp);
//       setTimeout(flicker, 1000);
//     };
//     flicker();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const repeatedLangs = repeatedLangsRef.current;

//   return (
//     // <div
//     //   style={{
//     //     width: "100vw",
//     //     height: "100vh",
//     //     background: "#111",
//     //     overflow: "hidden",
//     //     padding: "10px",
//     //     display: "flex",
//     //     alignItems: "center",
//     //     justifyContent: "center",
//     //   }}
//     // >
//     //   <div
//     //     style={{
//     //       display: "flex",
//     //       flexWrap: "wrap",
//     //       gap: "6px",
//     //       justifyContent: "center",
//     //       alignContent: "flex-start",
//     //       width: "100%",
//     //       height: "100%",
//     //     }}
//     //   >
//     //     {repeatedLangs.map((r, i) => {
//     //       const translit =
//     //         results.find((res) => res.code === r.code)?.value || text || "…";
//     //       return (
//     //         <Card
//     //           key={r.id}
//     //           lang={r.label}
//     //           value={translit}
//     //           color={r.color}
//     //           active={active[i]}
//     //           sizeType={r.sizeType}
//     //         />
//     //       );
//     //     })}
//     //   </div>
//     // </div>
//     <div
//       style={{
//         width: "100vw",
//         height: "100vh",
//         background: "#000",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       {/* CUSTOM RATIO WRAPPER */}
//       <div
//         style={{
//           aspectRatio: "2/3",   // <-- CUSTOM RATIO HERE
//           width: "100%",
//           maxWidth: "100vw",
//           maxHeight: "100vh",
//           background: "#111",
//           overflow: "hidden",
//           padding: "10px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "6px",
//             justifyContent: "center",
//             alignContent: "flex-start",
//             width: "100%",
//             height: "100%",
//           }}
//         >
//           {repeatedLangs.map((r, i) => {
//             const translit =
//               results.find((res) => res.code === r.code)?.value || text || "…";
//             return (
//               <Card
//                 key={r.id}
//                 lang={r.label}
//                 value={translit}
//                 color={r.color}
//                 active={active[i]}
//                 sizeType={r.sizeType}
//               />
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Display10;

import React, { useEffect, useRef, useState, useMemo } from "react";
import Card from "./components/Card";
import "./styles.css";
import { getWS, sendJSON } from "../../utils/ws";
import InputScreen from "./InputScreen";

const displayId = 10;

const LANGS = [
  { label: "Hindi (Devanagari)", itc: "hi-t-i0-und", code: "hi" },
  { label: "Marathi (Devanagari)", itc: "mr-t-i0-und", code: "mr" },
  { label: "Sanskrit (Devanagari)", itc: "sa-t-i0-und", code: "sa" },
  { label: "Nepali (Devanagari)", itc: "ne-t-i0-und", code: "ne" },
  { label: "Bengali", itc: "bn-t-i0-und", code: "bn" },
  { label: "Assamese", itc: "as-t-i0-und", code: "as" },
  { label: "Gujarati", itc: "gu-t-i0-und", code: "gu" },
  { label: "Punjabi (Gurmukhi)", itc: "pa-t-i0-und", code: "pa" },
  { label: "Odia", itc: "or-t-i0-und", code: "or" },
  { label: "Tamil", itc: "ta-t-i0-und", code: "ta" },
  { label: "Telugu", itc: "te-t-i0-und", code: "te" },
  { label: "Kannada", itc: "kn-t-i0-und", code: "kn" },
  { label: "Malayalam", itc: "ml-t-i0-und", code: "ml" },
];

const COLORS = [
  { bg: "#FFB3B3", text: "#400" },
  { bg: "#FFD699", text: "#442200" },
  { bg: "#B3E6B3", text: "#003300" },
  { bg: "#99D6FF", text: "#00334D" },
  { bg: "#D9B3FF", text: "#33004D" },
  { bg: "#FFB3E6", text: "#4D0033" },
  { bg: "#FFE699", text: "#4D3B00" },
  { bg: "#B3FFD9", text: "#00331F" },
  { bg: "#C2C2F0", text: "#1A0033" },
  { bg: "#FF9999", text: "#330000" },
  { bg: "#FFCC99", text: "#331A00" },
  { bg: "#B3FFB3", text: "#003300" },
  { bg: "#99CCFF", text: "#001A33" },
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function buildUrl(text, itc) {
  const base = "https://inputtools.google.com/request";
  const q = new URLSearchParams({
    text,
    itc,
    num: "5",
    cp: "0",
    cs: "1",
    ie: "utf-8",
    oe: "utf-8",
    app: "demopage",
  });
  return `${base}?${q.toString()}`;
}

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

async function tryTransliterate(text, itc) {
  const url = buildUrl(text, itc);
  const tryFetch = async (target) => {
    const r = await fetchWithTimeout(target);
    if (r.ok) {
      const data = await r.json();
      const cand = data?.[1]?.[0]?.[1]?.[0];
      if (data?.[0] === "SUCCESS" && cand) return cand;
    }
  };
  try {
    return (
      (await tryFetch(url)) ||
      (await tryFetch(`https://r.jina.ai/http://inputtools.google.com/request?${url.split("?")[1]}`)) ||
      (await tryFetch(`https://cors.isomorphic-git.org/${url}`)) ||
      "—"
    );
  } catch {
    return "—";
  }
}

const Display10 = () => {
  const ws = useMemo(() => getWS(), []);

  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [active, setActive] = useState([]);

  // persistent layout
  const repeatedLangsRef = useRef([]);
  if (repeatedLangsRef.current.length === 0) {
    repeatedLangsRef.current = Array.from({ length: 300 }, (_, i) => {
      const base = randomItem(LANGS);
      const color = randomItem(COLORS);
      const sizeType = randomItem(["small", "medium", "large"]);
      const initialActive = Math.random() > 0.3; // ~70% active
      return { ...base, color, sizeType, id: i, initialActive };
    });
  }

  // WS: register + listeners
  useEffect(() => {
    const onOpen = () => {
      sendJSON(ws, { type: "registerDisplay", displayId });
    };

    const onMessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }

      if (msg.type === "newName") {
        if (!msg?.name) return;
        setText(msg.name);
        return;
      }

      if (msg.type === "resetDisplay") {
        // setText("Param");
        setText("")
        setResults([]);
        return;
      }
    };

    if (ws.readyState === WebSocket.OPEN) onOpen();
    else ws.addEventListener("open", onOpen);

    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("message", onMessage);
      // don't close singleton
    };
  }, [ws]);

  // fetch transliterations whenever text changes
  useEffect(() => {
    let cancelled = false;
    if (!text) return;

    (async () => {
      const out = [];
      await Promise.all(
        LANGS.map(async (l) => {
          const value = await tryTransliterate(text, l.itc);
          out.push({ ...l, value });
        })
      );
      if (!cancelled) setResults(out);
    })();

    return () => {
      cancelled = true;
    };
  }, [text]);

  // continuous flicker
  useEffect(() => {
    const total = repeatedLangsRef.current.length;
    let current = repeatedLangsRef.current.map((r) => r.initialActive);
    setActive(current);

    let cancelled = false;
    const flicker = () => {
      if (cancelled) return;
      const temp = [...current];
      const numToToggle = 15 + Math.floor(Math.random() * 10);
      const indices = new Set();
      while (indices.size < numToToggle) {
        indices.add(Math.floor(Math.random() * total));
      }
      indices.forEach((i) => (temp[i] = !temp[i]));
      current = temp;
      setActive(temp);
      setTimeout(flicker, 1000);
    };
    flicker();

    return () => {
      cancelled = true;
    };
  }, []);

  const repeatedLangs = repeatedLangsRef.current;
  if (!text) {
  return  <InputScreen/>
}

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
     {text?( <div
        style={{
          aspectRatio: "2/3",
          width: "100%",
          maxWidth: "100vw",
          maxHeight: "100vh",
          background: "#111",
          overflow: "hidden",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            justifyContent: "center",
            alignContent: "flex-start",
            width: "100%",
            height: "100%",
          }}
        >
          {repeatedLangs.map((r, i) => {
            const translit =
              results.find((res) => res.code === r.code)?.value || text || "…";
            return (
              <Card
                key={r.id}
                lang={r.label}
                value={translit}
                color={r.color}
                active={active[i]}
                sizeType={r.sizeType}
              />
            );
          })}
        </div>
      </div>):
     ( <div
        style={{
          aspectRatio: "2/3",
          width: "100%",
          maxWidth: "100vw",
          maxHeight: "100vh",
          backgroundImage:"url(src/assets/glitch.gif)",
          objectFit:"contain"
        }}
      >
        
      </div>)}
    </div>
  );
};

export default Display10;

