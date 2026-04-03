// import { letterMap } from "../letterMap";
// import { useMemo } from "react";

// function generatePositions(count) {
//   return Array.from({ length: count }, () => ({
//     x: Math.random() * 80 + 10, // % (10%–90%)
//     y: Math.random() * 80 + 10, // % (10%–90%)
//     rotate: Math.random() * 20 - 10, // slight tilt
//     scale: 0.8 + Math.random() * 0.4,
//   }));
// }

// export default function ResultScreen({ name, onBack }) {
//   const letters = name.toLowerCase().split("");
//   const positions = useMemo(() => generatePositions(letters.length), [name]);

//   return (
//     <div className="relative flex h-screen w-screen items-center justify-center bg-[#111]">
//       <div className="relative aspect-[5/6] w-[min(90vw,75vh)] overflow-hidden bg-black">
//         <img
//           src="/App_9/background.svg"
//           alt="bg"
//           className="absolute inset-0 h-full w-full object-cover"
//           draggable={false}
//         />

//         <div className="absolute inset-0 flex items-center justify-center">
//           {/* <img src="/container.svg" alt="cartouche" className="h-[85%] w-auto" draggable={false} /> */}

//           <div className="absolute left-1/2 top-[17%] h-[65%] w-[30%] -translate-x-1/2">
//             {letters.map(
//               (char, i) =>
//                 letterMap[char] && (
//                   <img
//                     key={i}
//                     src={letterMap[char]}
//                     alt={char}
//                     className="pointer-events-none absolute w-[55px] max-w-[30%]"
//                     style={{
//                       left: `${positions[i].x}%`,
//                       top: `${positions[i].y}%`,
//                       transform: `translate(-50%, -50%) rotate(${positions[i].rotate}deg) scale(${positions[i].scale})`,
//                     }}
//                     draggable={false}
//                   />
//                 )
//             )}
//           </div>
//         </div>
//       </div>

//       <button
//         onClick={onBack}
//         className="absolute bottom-5 right-5 z-10 rounded-md bg-white/90 px-4 py-2 font-semibold text-black shadow hover:bg-white active:bg-white"
//       >
//         Back
//       </button>
//     </div>
//   );
// }

import { letterMap } from "../letterMap";
import { useMemo } from "react";

// const COLS = 3;

// export default function ResultScreen({ name, onBack }) {
//   const letters = name.toLowerCase().split("");
//   const total = letters.length;

//   const positions = useMemo(() => {
//     const rows = Math.ceil(total / COLS);
//     const grid = [];

//     for (let i = 0; i < total; i++) {
//       const row = Math.floor(i / COLS);
//       const col = i % COLS;

//       const itemsInLastRow = total % COLS || COLS;
//       const isLastRow = row === rows - 1;

//       let xPercent;

//       // // If last row is incomplete → center items
//       // if (isLastRow && itemsInLastRow < COLS) {
//       //   if (itemsInLastRow === 1) {
//       //     xPercent = 50; // center
//       //   } else if (itemsInLastRow === 2) {
//       //     // place between col1-col2 and col2-col3
//       //     xPercent = col === 0 ? 33 : 66;
//       //   }
//       // } else {
//       //   // Normal 3 column layout
//       //   xPercent = (col + 1) * (100 / (COLS + 1));
//       // }

//       if (isLastRow && itemsInLastRow < COLS) {
//         if (itemsInLastRow === 1) {
//           xPercent = 50;
//         } else if (itemsInLastRow === 2) {
//           xPercent = col === 0 ? 28 : 72;
//         }
//       } else {
//         const colPositions = [18, 50, 82];
//         xPercent = colPositions[col];
//       }

//       // const yPercent = (row + 1) * (100 / (rows + 1));
//       const topPadding = 8; // space from top
//       const bottomPadding = 8; // space from bottom
//       const usableHeight = 100 - topPadding - bottomPadding;

//       const step = rows > 1 ? usableHeight / (rows - 1) : 0;
//       const extraGap = 1.08; // 👈 increase slightly for more row gap

//       const yPercent = rows === 1 ? 50 : topPadding + row * step * extraGap;

//       grid.push({
//         x: xPercent,
//         y: yPercent,
//       });
//     }

//     return grid;
//   }, [total]);

//   return (
//     <div className="relative flex h-screen w-screen items-center justify-center bg-[#111]">
//       <div className="relative aspect-[5/6] w-[min(90vw,75vh)] overflow-hidden bg-black">
//         <img
//           src="/App_9/background.svg"
//           alt="bg"
//           className="absolute inset-0 h-full w-full object-cover"
//           draggable={false}
//         />

//         <div className="absolute left-1/2 top-[10%] h-[80%] w-[50%] -translate-x-1/2">
//           {letters.map(
//             (char, i) =>
//               letterMap[char] && (
//                 // <img
//                 //   key={i}
//                 //   src={letterMap[char]}
//                 //   alt={char}
//                 //   className="pointer-events-none absolute w-[32%] max-w-[160px]"
//                 //   style={{
//                 //     left: `${positions[i].x}%`,
//                 //     top: `${positions[i].y}%`,
//                 //     transform: "translate(-50%, -50%)",
//                 //   }}
//                 //   draggable={false}
//                 // />
//                 <img
//                   key={i}
//                   src={letterMap[char]}
//                   alt={char}
//                   className="pointer-events-none absolute w-[60%] max-w-[500px]"
//                   style={{
//                     left: `${positions[i].x}%`,
//                     top: `${positions[i].y}%`,
//                     transform: "translate(-50%, -50%)",
//                   }}
//                   draggable={false}
//                 />
//               ),
//           )}
//         </div>
//       </div>

//       <button
//         onClick={onBack}
//         className="absolute bottom-5 right-5 z-10 rounded-md bg-white/90 px-4 py-2 font-semibold text-black shadow hover:bg-white active:bg-white"
//       >
//         Back
//       </button>
//     </div>
//   );
// }

// import { letterMap } from "../letterMap";
// import { useMemo } from "react";

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

      <button
        onClick={onBack}
        className="absolute bottom-5 right-5 z-10 rounded-md bg-white/90 px-4 py-2 font-semibold text-black shadow hover:bg-white active:bg-white"
      >
        Back
      </button>
    </div>
  );
}
