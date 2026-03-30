import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getWS, sendJSON } from "../../utils/ws";
import { LetterImage } from "./component/LetterImage";

import { generateLettersForName } from "./utils/utils";

const DEFAULT_NAME = "";

const displayId = 4;

const Display4 = () => {
  const ws = useMemo(() => getWS(), []);

  const [displayName, setDisplayName] = useState("");
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [error, setError] = useState("");

  /* ------------------ Letter helpers Start------------------ */


 

  /* ------------------ Letter helpers End------------------ */

  /* ------------------ Default Start------------------ */

  const resetToDefault = useCallback(() => {
    const defaultLetters = generateLettersForName(DEFAULT_NAME);
    if (defaultLetters) {
      setSelectedLetters(defaultLetters);
      setDisplayName(DEFAULT_NAME);
      setError("");
    }
  }, [generateLettersForName]);

  useEffect(() => {
    resetToDefault();
  }, [resetToDefault]);

  /* ------------------ Default End------------------ */

  /* ------------------ Socket Start ------------------ */
  // WS register + listeners

  const handleSubmit = useCallback(
    (incomingName) => {
      const newLetters = generateLettersForName(incomingName);
      if (newLetters) {
        setSelectedLetters(newLetters);
        setDisplayName(incomingName);
      }
    },
    [generateLettersForName]
  );

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
        if (!msg?.name) return;
        handleSubmit(msg.name);
        return;
      }

      if (msg.type === "resetDisplay") {
        resetToDefault();
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
  }, [ws, handleSubmit, resetToDefault]);

  /* ------------------ Socket End------------------ */

  /* ------------------ Observe 11:2 Start ------------------ */

  const containerRef = useRef(null);

  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* ------------------ Observe 11:2 End ------------------ */

  return (
    <div className="w-screen h-screen bg-transparent flex items-center justify-center">
      {/* 11:2 kiosk canvas */}

    {displayName?(<div
        ref={containerRef}
        className="
          aspect-[11/2]
          w-full
          max-h-full
          flex
          items-center
          justify-center
          gap-[1%]
          bg-[url('src/pages/App_4/assets/Images/background/BGForLandSat.png')]
          bg-contain
          bg-no-repeat
          overflow-hidden
        "
      >
        {selectedLetters.map((letterData, index) => (
          <LetterImage
            key={`${displayName}-${index}`}
            data={letterData}
            index={index}
            totalLetters={selectedLetters.length}
            containerWidth={containerSize.width}
            containerHeight={containerSize.height}
            isSpace={!letterData}
          />
        ))}
      </div>):(<div
        ref={containerRef}
        className="
          aspect-[11/2]
          w-full
          max-h-full
          bg-contain
          overflow-hidden
        "
        style={{ backgroundImage: "url(src/pages/App_11/assets/glitch.gif)" }}
      >
       
      </div>)}

      
    </div>
  );
};

export default Display4;
