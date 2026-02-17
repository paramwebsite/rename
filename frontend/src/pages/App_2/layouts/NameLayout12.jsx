import React from "react";
import SVGLayout from "./Layout12SVG.jsx"; // your provided SVG file
const COLORS = ["#FE47C6", "#70FE99", "#7A5BFE"];
export default function NameLayout12({ name }) {
  const letters = name.toLowerCase().split("");

  // 👇 manually define centers of each grey rect
  const boxCenters = [
    { x: 553, y: 353 },
    { x: 940, y: 353 },
    { x: 430, y: 760 },
    { x: 680, y: 700 },
    { x: 920, y: 750 },
    { x: 1140, y: 820 },
    { x: 385, y: 1230 },
    { x: 430, y: 1570 },
    { x: 1090, y: 1500 },
    { x: 450, y: 1860 },
    { x: 770, y: 1050 },
    { x: 1150, y: 1180 },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg viewBox="0 0 1521 2117" style={{ width: "100%", height: "100%" }}>
        <SVGLayout />

        {letters.map((letter, index) => {
          if (!boxCenters[index]) return null;
          // 🎨 Pick random color for this letter
          const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
          return (
            <text
              key={index}
              x={boxCenters[index].x}
              y={boxCenters[index].y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Megazoid"
              fontSize="260"
              fill={randomColor}
            >
              {letter}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
