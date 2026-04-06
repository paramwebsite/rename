import React from "react";
import Layout3SVG from "./Layout3SVG";

export default function NameLayout3({ name }) {
  const letters = name.toLowerCase().split("");
  const COLORS = ["#FE47C6", "#70FE99", "#7A5BFE"];
  const slots = [
    // Top large box
    {
      x: 517.75,
      y: 196.75,
      w: 469,
      h: 462,
    },

    // Rotated left
    {
      x: 231.234,
      y: 658.75,
      w: 546.489,
      h: 474.296,
      transform: "rotate(4.16948 231.234 658.75)",
    },

    // Rotated right
    {
      x: 788.152,
      y: 723.736,
      w: 473.455,
      h: 387,
      transform: "rotate(-11.6969 788.152 723.736)",
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg viewBox="0 0 1521 2117" style={{ width: "100%", height: "100%" }}>
        <Layout3SVG />

        {letters.map((letter, index) => {
          if (!slots[index]) return null;

          const slot = slots[index];
          const centerX = slot.x + slot.w / 2;
          const centerY = slot.y + slot.h / 2 -70;
          const fontSize = slot.h * 0.8;
          const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
          const text = (
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Megazoid"
              fontSize="300"
              fill={randomColor}
              className="display2-text"
            >
              {letter}
            </text>
          );
          // 🎨 Pick random color for this letter
        
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
