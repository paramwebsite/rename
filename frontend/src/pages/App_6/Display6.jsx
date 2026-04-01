import React, { useEffect, useMemo, useState } from "react";
import { getWS, sendJSON } from "../../utils/ws";
import InputScreen from "./InputScreen";

const displayId = 6;

/* ---------------- UTILITIES ---------------- */

function ascii(str) {
  return str
    .split("")
    .map((c) => c.charCodeAt(0))
    .join("-");
}

function binary(str) {
  return str
    .split("")
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
}

function hex(str) {
  return str
    .split("")
    .map((c) => c.charCodeAt(0).toString(16))
    .join("");
}

function octal(str) {
  return str
    .split("")
    .map((c) => c.charCodeAt(0).toString(8))
    .join("-");
}

function unicode(str) {
  return str
    .split("")
    .map((c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"))
    .join("");
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return "E" + Math.abs(hash).toString(16);
}

function uuidFromName(str) {
  const base = simpleHash(str).padEnd(32, "0").slice(0, 32);
  return `${base.slice(0, 8)}-${base.slice(8, 12)}-${base.slice(
    12,
    16,
  )}-${base.slice(16, 20)}-${base.slice(20)}`;
}

/* ---------------- BACKGROUND ---------------- */

// function BackgroundNoise() {
//   const rows = 45;
//   const cols = 180;

//   const randomChar = () =>
//     String.fromCharCode(33 + Math.floor(Math.random() * 94));

//   const lines = Array.from({ length: rows }).map(() =>
//     Array.from({ length: cols })
//       .map(randomChar)
//       .join("")
//   );

//   return (
//     <div className="absolute inset-0 opacity-10 pointer-events-none select-none text-[#6bd1ff] font-mono text-[clamp(8px,0.7vw,14px)] leading-[1.1]">
//       {lines.map((l, i) => (
//         <div key={i}>{l}</div>
//       ))}
//     </div>
//   );
// }



function BackgroundNoise() {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fontSize = 12;
  const lineHeight = 14;
  const approxCharWidth = 7.2;

  const rows = Math.ceil(viewport.height / lineHeight) + 30;
  const cols = Math.ceil(viewport.width / approxCharWidth) + 40;

  const lines = useMemo(() => {
    const randomChar = () =>
      String.fromCharCode(33 + Math.floor(Math.random() * 94));

    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, randomChar).join("")
    );
  }, [rows, cols]);

  return (
    <>
      <style>{`
        @keyframes noiseScrollY {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-10">
        <div
          className="absolute inset-0 h-[200%] w-full"
          style={{ animation: "noiseScrollY 18s linear infinite" }}
        >
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="h-1/2 min-w-full text-[#6bd1ff] font-mono whitespace-pre"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeight}px`,
              }}
            >
              {lines.map((line, i) => (
                <div key={`${copy}-${i}`} className="min-w-full">
                  {line}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------- MAIN ---------------- */

const Display6 = () => {
  const ws = useMemo(() => getWS(), []);
  const [name, setName] = useState("");

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

      if (msg.type === "newName") setName(msg.name);
      if (msg.type === "resetDisplay") setName("");
    };

    if (ws.readyState === WebSocket.OPEN) onOpen();
    else ws.addEventListener("open", onOpen);

    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("message", onMessage);
    };
  }, [ws]);

  const analysis = useMemo(() => {
    if (!name) return null;

    return {
      ascii: ascii(name),
      uuid: uuidFromName(name),
      binary: binary(name),
      hash: simpleHash(name),
      hex: hex(name),
      octal: octal(name),
      unicode: unicode(name),
      tokens: name
        .split("")
        .map((c) => c.toUpperCase())
        .join(", "),
    };
  }, [name]);

  /* ---------------- CONDITIONAL RENDER ---------------- */

  if (!name) {
    return <InputScreen onSubmit={setName} />;
  }

  return (
    <div
      className="
      w-screen
      h-screen
      bg-gradient-to-br
      from-[#001f3f]
      via-[#00122a]
      to-[#000814]
      text-[#6bd1ff]
      font-mono
      relative
      overflow-hidden
    "
    >
      <BackgroundNoise />

      <div
        className="
        relative z-10
        h-full
        w-full
        p-[clamp(20px,4vw,80px)]
        text-[clamp(14px,1.5vw,24px)]
        space-y-[clamp(10px,1.2vw,22px)]
        overflow-auto
      "
      >
        <div className="text-[clamp(18px,2.2vw,32px)] mb-6">
          // The ASCII Code
        </div>

        <div>{"{" + analysis.ascii + "}"}</div>
        <div>{"{" + analysis.uuid + "}"}</div>

        <div>// Binary</div>
        <div className="break-all">{"{" + analysis.binary + "}"}</div>

        <div>// Hash Code</div>
        <div>{"{" + analysis.hash + "}"}</div>

        <div>// LCM Tokenisation</div>
        <div>{"{" + analysis.tokens + "}"}</div>

        <div>Memory Layout:</div>

        <div>Hexadecimal:</div>
        <div className="break-all">{analysis.hex}</div>

        <div>Octal:</div>
        <div className="break-all">{analysis.octal}</div>

        <div>Unicode Escape:</div>
        <div className="break-all">{analysis.unicode}</div>
      </div>
    </div>
  );
};

export default Display6;
