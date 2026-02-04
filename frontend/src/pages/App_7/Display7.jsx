import React, { useEffect, useMemo, useState } from "react";
import { getWS, sendJSON } from "../../utils/ws";

const displayId = 7;

const Display7 = () => {
  const ws = useMemo(() => getWS(), []);
  const [name, setName] = useState("");

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

  return (
    <div className="h-screen w-screen  flex flex-col items-center justify-center text-black">
      <p className="text-center text-2xl font-semibold  py-5 text-black">
        Display Name: Display-{displayId}
      </p>

      <h1 className="text-center text-2xl capitalize font-semibold">
        video Name: {name}
      </h1>
    </div>
  );
};

export default Display7;
