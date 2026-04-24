
import { letterMap } from "../letterMap";
import { useMemo } from "react";



export default function ResultScreen({ name, onBack }) {
  const letters = name.toLowerCase().split("");
  const total = letters.length;

  const { positions, cols, rows, imageWidth, maxWidth, innerWidth } =
    useMemo(() => {
      const cols = total >= 9 ? 3 : 2;
      const rows = Math.ceil(total / cols);

      const grid = [];

      const colPositionsMap = {
        2: [30, 70],
        3: [18, 50, 82],
      };

      const rowPositionsMap = {
        1: [50],
        2: [35, 65],
        3: [20, 50, 80],
        4: [10, 34, 62, 90],
        5: [8, 28, 50, 72, 92],
      };

      const rowPositions =
        rowPositionsMap[rows] ||
        Array.from({ length: rows }, (_, i) => 8 + i * (84 / (rows - 1)));

      for (let i = 0; i < total; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;

        const itemsInLastRow = total % cols || cols;
        const isLastRow = row === rows - 1;

        let xPercent;

        if (isLastRow && itemsInLastRow < cols) {
          if (cols === 2) {
            xPercent = itemsInLastRow === 1 ? 50 : colPositionsMap[2][col];
          } else {
            if (itemsInLastRow === 1) {
              xPercent = 50;
            } else if (itemsInLastRow === 2) {
              xPercent = col === 0 ? 32 : 68;
            }
          }
        } else {
          xPercent = colPositionsMap[cols][col];
        }

        grid.push({
          x: xPercent,
          y: rowPositions[row],
        });
      }

      let imageWidth = "42%";
      let maxWidth = "260px";
      let innerWidth = "72%";

      if (cols === 3) {
        imageWidth = "26%";
        maxWidth = "150px";
        innerWidth = "82%";
      } else if (rows >= 5) {
        imageWidth = "30%";
        maxWidth = "180px";
      } else if (rows === 4) {
        imageWidth = "34%";
        maxWidth = "210px";
      }

      return { positions: grid, cols, rows, imageWidth, maxWidth, innerWidth };
    }, [total]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-[#111]">
      <div className="relative aspect-[5/6] w-[min(90vw,75vh)] overflow-hidden bg-black">
        <img
          src="/App_9/background.svg"
          alt="bg"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        <div
          className="absolute left-1/2 top-[8%] h-[84%] -translate-x-1/2"
          style={{ width: innerWidth }}
        >
          {letters.map(
            (char, i) =>
              letterMap[char] && (
                <img
                  key={i}
                  src={letterMap[char]}
                  alt={char}
                  className="pointer-events-none absolute"
                  style={{
                    width: imageWidth,
                    maxWidth,
                    left: `${positions[i].x}%`,
                    top: `${positions[i].y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  draggable={false}
                />
              ),
          )}
        </div>
      </div>

    
    </div>
  );
}
