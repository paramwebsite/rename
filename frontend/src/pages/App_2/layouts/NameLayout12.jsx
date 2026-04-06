// import React from "react";
// import SVGLayout from "./Layout12SVG.jsx"; // your provided SVG file
// const COLORS = ["#FE47C6", "#70FE99", "#7A5BFE"];
// export default function NameLayout12({ name }) {
//   const letters = name.toLowerCase().split("");

//   // 👇 manually define centers of each grey rect
//   const boxCenters = [
//     { x: 553, y: 353 },
//     { x: 940, y: 353 },
//     { x: 430, y: 760 },
//     { x: 680, y: 700 },
//     { x: 920, y: 750 },
//     { x: 1140, y: 820 },
//     { x: 385, y: 1230 },
//     { x: 430, y: 1570 },
//     { x: 1090, y: 1500 },
//     { x: 450, y: 1860 },
//     { x: 770, y: 1050 },
//     { x: 1150, y: 1180 },
//   ];

//   return (
//     <div style={{ width: "100%", height: "100%" }}>
//       <svg viewBox="0 0 1521 2117" style={{ width: "100%", height: "100%" }}>
//         <SVGLayout />

//         {letters.map((letter, index) => {
//           if (!boxCenters[index]) return null;
//           // 🎨 Pick random color for this letter
//           const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
//           return (
//             <text
//               key={index}
//               x={boxCenters[index].x}
//               y={boxCenters[index].y}
//               textAnchor="middle"
//               dominantBaseline="middle"
//               fontFamily="Megazoid"
//               fontSize="260"
//               fill={randomColor}
//             >
//               {letter}
//             </text>
//           );
//         })}
//       </svg>
//     </div>
//   );
// }


import React from "react";
import SVGLayout from "./Layout12SVG.jsx";

const COLORS = ["#FE47C6", "#70FE99", "#7A5BFE"];

export default function NameLayout12({ name }) {
  const letters = name.toLowerCase().split("");

  const slots = [
    { x: 386.75, y: 169.75, w: 334, h: 368, fontSize: 250 },
    { x: 754.75, y: 169.75, w: 372, h: 368, fontSize: 250 },

    { x: 272.751, y: 552.75, w: 288, h: 453, fontSize: 220, rotate: 12.7532 },
    { x: 567.799, y: 573.75, w: 226.954, h: 232.639, fontSize: 180, rotate: 3.46218 },
    { x: 810.799, y: 567.75, w: 226.954, h: 298.251, fontSize: 210, rotate: 3.46218 },
    { x: 1053.26, y: 592.283, w: 203.431, h: 401.634, fontSize: 210, rotate: -7.01904 },

    { x: 196.75, y: 1081.75, w: 381, h: 301, fontSize: 235 },
    { x: 278.75, y: 1420.77, w: 259, h: 301, fontSize: 210, rotate: -3.10286 },
    { x: 982.219, y: 1374.75, w: 225.016, h: 227.494, fontSize: 180, rotate: 2.13331 },
    { x: 362.75, y: 1765.13, w: 188.398, h: 191.08, fontSize: 165, rotate: -8.66267 },

    { x: 602.75, y: 907.75, w: 331, h: 301, fontSize: 235 },
    { x: 973.75, y: 1020.75, w: 359, h: 326, fontSize: 225 },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg viewBox="0 0 1521 2117" style={{ width: "100%", height: "100%" }}>
        <SVGLayout />

        {letters.map((letter, index) => {
          const slot = slots[index];
          if (!slot) return null;

          const centerX = slot.x + slot.w / 2;
          const centerY = slot.y + slot.h / 2 -70;
          const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

          const text = (
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Megazoid"
              fontSize={slot.fontSize}
              fill={randomColor}
              className="display2-text"
            >
              {letter}
            </text>
          );

          return slot.rotate ? (
            <g
              key={index}
              transform={`rotate(${slot.rotate} ${centerX} ${centerY})`}
            >
              {text}
            </g>
          ) : (
            <g key={index}>{text}</g>
          );
        })}
      </svg>
    </div>
  );
}