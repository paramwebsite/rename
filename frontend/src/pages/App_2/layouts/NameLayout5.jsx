import React from "react";
import Layout5SVG from "./Layout5SVG";
const COLORS = ["#FE47C6", "#70FE99", "#7A5BFE"];
export default function NameLayout5({ name }) {
  const letters = name.toLowerCase().split("");

  const slots = [
    // Top row
    { x: 386.75, y: 269.75, w: 334, h: 368 },
    { x: 754.75, y: 269.75, w: 372, h: 368 },

    // Large rotated left
    {
      x: 263.951,
      y: 658.535,
      w: 364.237,
      h: 613.676,
      transform: "rotate(4.16948 263.951 658.535)",
    },

    // Center tall
    { x: 652.75, y: 672.75, w: 264, h: 417 },

    // Rotated right
    {
      x: 940.319,
      y: 715.156,
      w: 312.378,
      h: 387,
      transform: "rotate(-14.3472 940.319 715.156)",
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg viewBox="0 0 1521 2117" style={{ width: "100%", height: "100%" }}>
        <Layout5SVG />

        {slots.map((slot, index) => {
          const letter = letters[index];
          if (!letter) return null;

          const centerX = slot.x + slot.w / 2;
          const centerY = slot.y + slot.h / 2;
          // 🎨 Pick random color for this letter
          const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
          const textElement = (
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Megazoid"
              fontSize="300"
              fill={randomColor}
            >
              {letter}
            </text>
          );

          return slot.transform ? (
            <g key={index} transform={slot.transform}>
              {textElement}
            </g>
          ) : (
            <g key={index}>{textElement}</g>
          );
        })}
      </svg>
    </div>
  );
}
