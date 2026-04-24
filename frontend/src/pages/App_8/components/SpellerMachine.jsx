// SpellerMachine.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { periodicElements } from "../data/periodicElements";

export function SpellerMachine({
  elements,
  inputValue,
  shouldAnimate,
  setShouldAnimate,
  onReset,
}) {
  const getCardSize = (count) => {
    console.log(count);
    if (count <= 4) return "w-[300px] sm:w-[350px]";
    if (count <= 6) return "w-[120px] sm:w-[140px]";
    if (count <= 8) return "w-[160px] sm:w-[220px]";
    if (count <= 10) return "w-[80px] sm:w-[100px]";
    return "w-[70px] sm:w-[90px]";
  };

  // Auto clear after 60s
  useEffect(() => {
    if (!elements.length) return;
    const t = setTimeout(() => {
      onReset();
    }, 60000);
    return () => clearTimeout(t);
  }, [elements, onReset]);

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
          if (index === elements.length - 1) setShouldAnimate(false);
        }, spinDuration + spinDelay);
      }

      return () => {
        clearInterval(intervalTimer);
        clearTimeout(spinTimer);
      };
    }, [isSpinning, index, elements.length, setShouldAnimate]);

    const displayElement = isSpinning
      ? periodicElements[currentIndex]
      : element;

    return (
      <motion.div
        className="relative h-full w-full flex flex-col "
        animate={{
          opacity: isSpinning ? 0.7 : 1,
          scale: isSpinning ? 0.95 : 1,
        }}
      >
        <div className="relative z-10 h-full flex flex-col p-3">
          <div className="text-2xl text-blue-200 self-end">
            {displayElement.atomicNumber}
          </div>
          <div className="flex-1 flex items-center justify-center -translate-y-2">
            <div className="text-7xl font-bold text-white">
              {displayElement.symbol}
            </div>
          </div>

          <div className="text-xl text-blue-200 text-center -translate-y-2">
            {displayElement.fullName}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative w-full h-full ">
      <AnimatePresence>
        {elements.length > 0 && (
          <motion.div
            className="w-full h-full  bg-[#23313F] rounded-lg   flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className=" w-full flex justify-center items-center  flex-wrap gap-4 border-2">
              {elements.map((el, i) => (
                <div
                  key={`${el.symbol}-${i}`}
                  className={`${getCardSize(
                    elements.length,
                  )} aspect-square bg-gradient-to-br ${el.color?.from} ${el.color?.to} rounded-lg overflow-hidden shadow-lg`}
                >
                  <SlotMachineContent element={el} index={i} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
