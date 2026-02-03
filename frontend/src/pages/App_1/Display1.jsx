import React, { useEffect, useMemo, useState } from "react";
import { getWS, sendJSON } from "../../utils/ws";

const displayId = 1;

const Display1 = () => {
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
    <div className="h-screen w-screen flex items-center justify-center">


      <div className="aspect-[5/6] h-full  bg-black overflow-hidden text-white">
        <p className="text-center text-2xl font-semibold  py-5">
          Display Name: Display-{displayId}
        </p>

        <div className="max-w-7xl mx-auto pt-10">
          <h1 className="text-center text-2xl capitalize font-semibold">
            Formula Name: {name}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Display1;
