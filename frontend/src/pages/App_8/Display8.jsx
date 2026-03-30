// Display8.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { SpellerMachine } from "./components/SpellerMachine";
import { processText } from "./components/spellerUtils";
import { getWS, sendJSON } from "../../utils/ws";

const displayId = 8;

const Display8 = () => {
  const [inputValue, setInputValue] = useState("");
  const [elements, setElements] = useState([]);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const ws = useMemo(() => getWS(), []);

  // 🔥 this now lives in Display8
  const handleSubmit = useCallback((val) => {
    const text = (val || "").trim();
    if (!text) return;

    const processed = processText(text);
    setElements(processed);
    setShouldAnimate(true);
  }, []);

  const resetDisplay = useCallback(() => {
    setElements([]);
    setInputValue("");
    setShouldAnimate(false);
  }, []);

  // 🔥 FULL websocket logic here
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

        // 👇 store it here
        setInputValue(msg.name);

        console.log(msg.name)
        // 👇 call handleSubmit from Display8
        handleSubmit(msg.name);
        return;
      }

      if (msg.type === "resetDisplay") {
        resetDisplay();
      }
    };

    if (ws.readyState === WebSocket.OPEN) {
      onOpen();
    } else {
      ws.addEventListener("open", onOpen);
    }

    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("message", onMessage);
    };
  }, [ws, handleSubmit, resetDisplay]);

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">


    {inputValue?(
      <div className="aspect-[4/1] w-full max-w-screen overflow-hidden">
        <div className="min-h-full bg-[#0A1A2A] text-white">
          <div className="container mx-auto py-8">
            <header className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">
                Periodic Speller
              </h1>
              <p className="text-xl opacity-90">
                Discover the elements in your words!
              </p>
            </header>

            <main>
              <SpellerMachine
                elements={elements}
                inputValue={inputValue}
                shouldAnimate={shouldAnimate}
                setShouldAnimate={setShouldAnimate}
                onReset={resetDisplay}
              />
            </main>
          </div>
        </div>
      </div>
    ):( <div className="aspect-[4/1] w-full max-w-screen overflow-hidden"
      style={{ backgroundImage: "url(src/pages/App_11/assets/glitch.gif)" }}>
      </div>)}
      


     
    </div>
  );
};

export default Display8;
