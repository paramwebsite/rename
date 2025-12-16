import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getWS, sendJSON } from "../../utils/ws";
import { LetterImage } from "./component/LetterImage";
import lettersData from "./data/letters.json";

const DEFAULT_NAME = "PARAM";
const MAX_CHARS = 25;
const displayId = 4;

const Display4 = () => {
  const ws = useMemo(() => getWS(), []);

  const [displayName, setDisplayName] = useState("");
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [error, setError] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  /* ------------------ Letter helpers Start------------------ */
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

  /* ------------------ Letter helpers End------------------ */

  /* ------------------ Default Start------------------ */

  const resetToDefault = useCallback(() => {
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

  /* ------------------ Default End------------------ */

  /* ------------------ Socket Start ------------------ */
  // WS register + listeners

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
      <div
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
      </div>
    </div>
  );
};

export default Display4;
