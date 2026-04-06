import React from "react";
import Layout4SVG from "./Layout4SVG";

export default function NameLayout4({ name }) {
  const letters = name.toLowerCase().split("");
  const COLORS = ["#FE47C6", "#70FE99", "#7A5BFE"];

  const slots = [
    // Top left
    { x: 386.75, y: 269.75, w: 334, h: 368 },

    // Top right
    { x: 754.75, y: 269.75, w: 372, h: 368 },

    // Large rotated left
    {
      x: 263.951,
      y: 658.535,
      w: 546.489,
      h: 474.296,
      transform: "rotate(4.16948 263.951 658.535)",
    },

    // Rotated right
    {
      x: 838.75,
      y: 713.26,
      w: 421.785,
      h: 387,
      transform: "rotate(-11.6969 838.75 713.26)",
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg viewBox="0 0 1521 2117" style={{ width: "100%", height: "100%" }}>
        <Layout4SVG />

        {slots.map((slot, index) => {
          const letter = letters[index];
          if (!letter) return null;

          const centerX = slot.x + slot.w / 2;
          const centerY = slot.y + slot.h / 2 -70;
          // 🎨 Pick random color for this letter
          const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
          const text = (
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Megazoid"
              fontSize="300"
              fill={randomColor}
              className="display2-text"
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
