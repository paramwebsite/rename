import React from "react";
import SVGLayout from "./Layout11SVG"; // your SVG component file
import "../Display2.css";
const COLORS = ["#FE47C6", "#70FE99", "#7A5BFE"];
export default function NameLayout11({ name }) {
  const letters = name.toLowerCase().split("");

  return (
    <div className="name-layout">
      <SVGLayout />

      {/* Overlay letters */}
      <div className="letter-layer">
        {letters.map((letter, i) => {
          // 🎨 Pick random color for this letter
          const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
          return (
            <div>
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="Megazoid"
                fontSize="260"
                fill={randomColor}
              >
                {letter}
              </text>
            </div>
          );
        })}
      </div>
    </div>
  );
}
