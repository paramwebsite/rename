import React, { useEffect, useMemo, useState } from "react";
import ResultScreen from "./ResultScreen";
import InputScreen from "./InputScreen";
import { getWS, sendJSON } from "../../utils/ws";

/**
 * Name → Scientific Formula Engine
 * - Greedy matching (longest patterns first)
 * - Pattern bank ~150
 * - Deterministic alternate symbol selection per name
 * - Chalkboard result with chalk-writing animation
 */

/* ------------------------------ utilities ------------------------------ */



/* ------------------------------ pattern bank ------------------------------ */



/* ------------------------------ compiler ------------------------------ */



/* ------------------------------ Chalk writer ------------------------------ */



/* ------------------------------ UI ------------------------------ */





/* ------------------------------ main app ------------------------------ */





const displayId = 1;

export default function Display1() {
  const [screen, setScreen] = useState("input");
  const [name, setName] = useState("");


  const handlesubmit= (nm) => {
        const clean = nm.trim();
        if (!clean) return;
        setName(clean);
        setScreen("result");
      }






      // --------------------------------- web socket start--------------------------
const ws = useMemo(() => getWS(), []);

  useEffect(() => {
    const onOpen = () => {
      // register this display
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
        console.log("Received new name:", msg.name);
        setName(msg.name);
        handlesubmit(msg.name)
      }

      if (msg.type === "resetDisplay") {
        setName("");
      }
    };

    if (ws.readyState === WebSocket.OPEN) onOpen();
    else ws.addEventListener("open", onOpen);

    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("message", onMessage);
      // ⚠️ don't ws.close() because ws is a shared singleton (like your old getSocket)
    };
  }, [ws]);








      // --------------------------------- web socket End--------------------------
















  return screen === "input" ? (
    <InputScreen
      onSubmit={handlesubmit}
    />
  ) : (
    <ResultScreen
      name={name}
      onBack={() => {
        setScreen("input");
      }}
    />
  );
}
