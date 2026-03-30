import React from "react";
import Layout6SVG from "./Layout6SVG";
const COLORS = ["#FE47C6", "#70FE99", "#7A5BFE"];
export default function NameLayout6({ name }) {
  const letters = name.toLowerCase().split("");

  const slots = [
    // Top row
    { x: 386.75, y: 169.75, w: 334, h: 368 },
    { x: 754.75, y: 169.75, w: 372, h: 368 },

    // Middle rotated
    {
      x: 572.354,
      y: 548.074,
      w: 437.849,
      h: 380.737,
      transform: "rotate(3.59439 572.354 548.074)",
    },

    // Bottom row
    { x: 173.75, y: 989.75, w: 419, h: 301 },
    { x: 628.75, y: 990.75, w: 260, h: 218 },
    { x: 940.75, y: 976.75, w: 389, h: 387 },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg viewBox="0 0 1521 2117" style={{ width: "100%", height: "100%" }}>
        <Layout6SVG />

        {slots.map((slot, index) => {
          const letter = letters[index];
          if (!letter) return null;
          // 🎨 Pick random color for this letter
          const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
          const centerX = slot.x + slot.w / 2;
          const centerY = slot.y + slot.h / 2;

          const text = (
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Megazoid"
              fontSize="270"
              fill={randomColor}
            >
              {letter}
            </text>
          );

          return slot.transform ? (
            <g key={index} transform={slot.transform}>
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
