
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { periodicElements } from "../data/periodicElements";
import { getWS, sendJSON } from "../../../utils/ws"; // ⬅️ use the singleton (see earlier step)

const specialElements = {
  j: { symbol: "J", atomicNumber: "-", fullName: "Joule", type: "nonmetal", color: { from: "from-emerald-600/80", to: "to-emerald-400/80" } },
  e: { symbol: "e⁻", atomicNumber: "-", fullName: "Electron", type: "nonmetal", color: { from: "from-emerald-600/80", to: "to-emerald-400/80" } },
  r: { symbol: "R", atomicNumber: "-", fullName: "Roentgen", type: "nonmetal", color: { from: "from-emerald-600/80", to: "to-emerald-400/80" } },
  m: { symbol: "M", atomicNumber: "-", fullName: "Mole", type: "nonmetal", color: { from: "from-emerald-600/80", to: "to-emerald-400/80" } },
};

export function SpellerMachine({ displayId }) {
  const [inputValue, setInputValue] = useState("");
  const [elements, setElements] = useState([]);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const ws = useMemo(() => getWS(), []);


const processText = useCallback((text) => {
    const results = [];
    let remaining = (text || "").toLowerCase().replace(/[^a-z]/g, "");

    while (remaining.length > 0) {
      let matched = false;

      if (remaining.length >= 2) {
        const two = remaining.slice(0, 2);
        const el2 = periodicElements.find((e) => e.symbol.toLowerCase() === two);
        if (el2) {
          results.push({
            symbol: el2.symbol,
            atomicNumber: el2.atomicNumber,
            fullName: el2.name,
            type: el2.type,
            color: el2.color,
          });
          remaining = remaining.slice(2);
          matched = true;
          continue;
        }
      }

      const one = remaining[0];
      if (specialElements[one]) {
        results.push(specialElements[one]);
        matched = true;
      } else {
        const el1 = periodicElements.find((e) => e.symbol.toLowerCase() === one);
        if (el1) {
          results.push({
            symbol: el1.symbol,
            atomicNumber: el1.atomicNumber,
            fullName: el1.name,
            type: el1.type,
            color: el1.color,
          });
          matched = true;
        }
      }

      if (!matched) {
        results.push({
          symbol: one.toUpperCase(),
          atomicNumber: "-",
          fullName: one.toUpperCase(),
          type: "nonmetal",
          color: { from: "from-gray-600/80", to: "to-gray-400/80" },
        });
      }

      remaining = remaining.slice(1);
    }

    return results;
  }, []);





   const handleSubmit = useCallback((val) => {
    const text = (val || "").trim();
    if (!text) return;
    const processed = processText(text);
    setElements(processed);
    setShouldAnimate(true);
  }, [processText]);













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
        setInputValue(msg.name);
        handleSubmit(msg.name);
        return;
      }

      if (msg.type === "resetDisplay") {
        setElements([]);
        setInputValue("");
        setShouldAnimate(false);
        return;
      }
    };

    if (ws.readyState === WebSocket.OPEN) onOpen();
    else ws.addEventListener("open", onOpen);

    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("message", onMessage);
      // do NOT close singleton
    };
  }, [ws, displayId, handleSubmit]);
  // ---- socket wiring



  // ---- name → element tiles
  

 

  // auto clear after 60s (optional; resetDisplay will also clear)
  useEffect(() => {
    if (!elements.length) return;
    const t = setTimeout(() => {
      setElements([]);
      setInputValue("");
      setShouldAnimate(false);
    }, 60000);
    return () => clearTimeout(t);
  }, [elements]);

  // ---- inner tile
  const SlotMachineContent = ({ element, index }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const spinDuration = 2000;
    const spinDelay = index * 300;
    const spinInterval = 50;

    useEffect(() => {
      if (shouldAnimate) setIsSpinning(true);
    }, [shouldAnimate]);

    useEffect(() => {
      let spinTimer;
      let intervalTimer;

      const sequence = Array.from({ length: 20 }, () => {
        const randIndex = Math.floor(Math.random() * periodicElements.length);
        return periodicElements[randIndex];
      });

      if (isSpinning) {
        intervalTimer = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % sequence.length);
        }, spinInterval);

        spinTimer = setTimeout(() => {
          clearInterval(intervalTimer);
          setIsSpinning(false);
          // stop global animation after the last tile settles
          if (index === elements.length - 1) setShouldAnimate(false);
        }, spinDuration + spinDelay);
      }

      return () => {
        clearInterval(intervalTimer);
        clearTimeout(spinTimer);
      };
    }, [element, index, isSpinning, elements.length]);

    const displayElement = isSpinning ? periodicElements[currentIndex] : element;

    return (
      <motion.div
        className="relative h-full w-full flex flex-col"
        animate={{ opacity: isSpinning ? 0.7 : 1, scale: isSpinning ? 0.95 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
        <motion.div
          key={displayElement.symbol}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          className="relative z-10 h-full flex flex-col p-2 sm:p-3"
        >
          <div className="text-xs sm:text-sm text-blue-200 self-end">
            {displayElement.atomicNumber}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {displayElement.symbol}
            </div>
          </div>
          <div className="text-[10px] sm:text-xs text-blue-200 text-center">
            {displayElement.fullName}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const getCardSize = (count) => {
    if (count <= 4) return "w-[140px] sm:w-[160px]";
    if (count <= 6) return "w-[120px] sm:w-[140px]";
    if (count <= 8) return "w-[100px] sm:w-[120px]";
    if (count <= 10) return "w-[80px] sm:w-[100px]";
    return "w-[70px] sm:w-[90px]";
  };

  return (
    <div className="relative px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        {elements.length > 0 && (
          <motion.div
            className="relative w-full max-w-[95vw] mx-auto bg-[#23313F] rounded-lg p-4 sm:p-6 lg:p-8 mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="space-y-6 sm:space-y-8">
              <div className="flex justify-center flex-wrap gap-2 sm:gap-4">
                {elements.map((el, i) => (
                  <motion.div
                    key={`${el.symbol}-${i}`}
                    className={`${getCardSize(elements.length)} aspect-square bg-gradient-to-br ${el.color?.from || "from-gray-600"} ${el.color?.to || "to-gray-400"} rounded-lg overflow-hidden shadow-lg border border-white/10`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <SlotMachineContent element={el} index={i} />
                  </motion.div>
                ))}
              </div>

              {elements.length > 0 && (
                <motion.div
                  className="text-center text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: elements.length * 0.2 + 2 }}
                >
                  {elements.map((el, i) => (
                    <span key={`${el.symbol}-${i}`} className="inline-block mx-1 text-sm sm:text-base">
                      {el.symbol}
                      <sub className="text-blue-200">
                        {el.atomicNumber !== "-" ? `(${el.atomicNumber})` : ""}
                      </sub>
                    </span>
                  ))}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                <div className="relative px-4 py-6 text-center">
                  <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <p className="text-white/90 text-lg sm:text-xl font-medium">{inputValue}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
