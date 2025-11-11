import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  isVisible: boolean;
}

export function Keyboard({ onKeyPress, isVisible }: KeyboardProps) {
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-12 left-0 right-0 p-2 sm:p-4"
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <div className="max-w-4xl mx-auto bg-white/10 rounded-lg p-2 sm:p-4 backdrop-blur-sm">
            {keys.map((row, i) => (
              <div key={i} className="flex justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                {row.map((key) => (
                  <motion.button
                    key={key}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-800/50 rounded-lg text-white text-sm sm:text-xl font-semibold hover:bg-blue-700/50 transition-colors"
                    onClick={() => onKeyPress(key)}
                  >
                    {key}
                  </motion.button>
                ))}
              </div>
            ))}
            
            <div className="flex justify-center gap-1 sm:gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-8 py-2 sm:py-3 bg-blue-600 rounded-lg text-white text-sm sm:text-base font-semibold hover:bg-blue-500 transition-colors"
                onClick={() => onKeyPress(' ')}
              >
                SPACE
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-8 py-2 sm:py-3 bg-blue-600 rounded-lg text-white text-sm sm:text-base font-semibold hover:bg-blue-500 transition-colors"
                onClick={() => onKeyPress('BACKSPACE')}
              >
                DELETE
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-8 py-2 sm:py-3 bg-blue-600 rounded-lg text-white text-sm sm:text-base font-semibold hover:bg-blue-500 transition-colors"
                onClick={() => onKeyPress('ENTER')}
              >
                ENTER
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}