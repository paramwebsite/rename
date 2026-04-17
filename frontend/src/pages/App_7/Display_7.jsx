import { AnimatePresence } from "motion/react";
import ScreenFrame from "./components/ScreenFrame";
import SquareStage from "./components/SquareStage";
import NameForm from "./components/NameForm";
import ActionBar from "./components/ActionBar";
import React, { useEffect, useMemo, useState } from "react";
import { getWS, sendJSON } from "../../utils/ws";

import { useCallback, useRef } from "react";
import { getEnabledStyles } from "./styles/styleRegistry";

const displayId = 7;

export function useRandomStyle() {
  const enabledStyles = getEnabledStyles();
  const [currentStyle, setCurrentStyle] = useState(null);
  const historyRef = useRef([]);

  const pickRandomStyle = useCallback(() => {
    if (enabledStyles.length === 0) return null;
    if (enabledStyles.length === 1) {
      setCurrentStyle(enabledStyles[0]);
      return enabledStyles[0];
    }

    // To cycle fairly, keep track of unplayed styles
    let available = enabledStyles.filter(
      (s) => !historyRef.current.includes(s.id),
    );

    // If all have been played, reset history but exclude the very last one played to avoid immediate repeat
    if (available.length === 0) {
      const lastPlayed = historyRef.current[historyRef.current.length - 1];
      historyRef.current = [lastPlayed];
      available = enabledStyles.filter((s) => s.id !== lastPlayed);
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const selected = available[randomIndex];

    historyRef.current.push(selected.id);
    setCurrentStyle(selected);

    return selected;
  }, [enabledStyles]);

  return { currentStyle, pickRandomStyle };
}

export default function Display_7() {
  const [name, setName] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const { currentStyle, pickRandomStyle } = useRandomStyle();

  const handleNameSubmit = (enteredName) => {
    setName(enteredName);
    pickRandomStyle();
    setIsAnimating(true);
  };

  const handleTryAnother = () => {
    pickRandomStyle();
    setReplayKey((prev) => prev + 1);
  };

  const handleEditName = () => {
    setIsAnimating(false);
    setName("");
  };

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
  };

  const StyleComponent = currentStyle?.component;

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
        handleNameSubmit(msg.name);
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
    <ScreenFrame>
      <SquareStage>
        <AnimatePresence mode="wait">
          {!name ? (
            // <NameForm key="form" onSubmit={handleNameSubmit} />
            <div
              className="w-full h-full   relative overflow-hidden  "
              style={{
                backgroundImage: "url(src/pages/App_11/assets/glitch.gif)",
              }}
            ></div>
          ) : (
            <div key="animation" className="absolute inset-0 bg-black">
              {StyleComponent && (
                <StyleComponent
                  key={`${currentStyle.id}-${replayKey}`}
                  name={name}
                  isActive={isAnimating}
                />
              )}
              {/* <ActionBar
                onTryAnother={handleTryAnother}
                onEditName={handleEditName}
                onReplay={handleReplay}
              /> */}
            </div>
          )}
        </AnimatePresence>
      </SquareStage>
    </ScreenFrame>
  );
}
