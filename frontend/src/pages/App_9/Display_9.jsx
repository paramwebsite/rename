// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import InputScreen from "./components/InputScreen";
import ResultScreen from "./components/ResultScreen";
import { getWS, sendJSON } from "../../utils/ws";

const displayId = 9;

export default function Display_9() {
  const [name, setName] = useState(null);

  const handleSubmit = (name) => {
    setName(name);
  };

  // --------------------------- web socket start ------------------------------

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
        // setName(msg.name);
        handleSubmit(msg.name);
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

  // --------------------------- web socket End ------------------------------

  // useEffect(()=>{

  //   setTimeout(() => {

  //     handleSubmit("abhishek");
  //   }, 2000);
  // },[])

  return name ? (
    <ResultScreen name={name} onBack={() => setName(null)} />
  ) : (
    <InputScreen onSubmit={setName} />
  );
}
