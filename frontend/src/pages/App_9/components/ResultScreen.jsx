import { letterMap } from "../letterMap";
import { useMemo } from "react";

function generatePositions(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 80 + 10, // % (10%–90%)
    y: Math.random() * 80 + 10, // % (10%–90%)
    rotate: Math.random() * 20 - 10, // slight tilt
    scale: 0.8 + Math.random() * 0.4,
  }));
}

export default function ResultScreen({ name, onBack }) {
  const letters = name.toLowerCase().split("");
  const positions = useMemo(() => generatePositions(letters.length), [name]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-[#111]">
      <div className="relative aspect-[5/6] w-[min(90vw,75vh)] overflow-hidden bg-black">
        <img
          src="/App_9/background.svg"
          alt="bg"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          {/* <img src="/container.svg" alt="cartouche" className="h-[85%] w-auto" draggable={false} /> */}

          <div className="absolute left-1/2 top-[17%] h-[65%] w-[30%] -translate-x-1/2">
            {letters.map(
              (char, i) =>
                letterMap[char] && (
                  <img
                    key={i}
                    src={letterMap[char]}
                    alt={char}
                    className="pointer-events-none absolute w-[55px] max-w-[30%]"
                    style={{
                      left: `${positions[i].x}%`,
                      top: `${positions[i].y}%`,
                      transform: `translate(-50%, -50%) rotate(${positions[i].rotate}deg) scale(${positions[i].scale})`,
                    }}
                    draggable={false}
                  />
                )
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onBack}
        className="absolute bottom-5 right-5 z-10 rounded-md bg-white/90 px-4 py-2 font-semibold text-black shadow hover:bg-white active:bg-white"
      >
        Back
      </button>
    </div>
  );
}
