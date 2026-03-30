import React from "react";
import Layout8SVG from "./Layout8SVG";
const COLORS = ["#FE47C6", "#70FE99", "#7A5BFE"];
export default function NameLayout8({ name }) {
  const letters = name.toLowerCase().split("");

  // Exact rectangles from your SVG (8 total)
  const slots = [
    // Top row
    { x: 386.75, y: 169.75, w: 334, h: 368 },
    { x: 754.75, y: 169.75, w: 372, h: 368 },

    // Left rotated
    {
      x: 272.751,
      y: 552.75,
      w: 288,
      h: 453,
      transform: "rotate(12.7532 272.751 552.75)",
    },

    // Big middle rotated
    {
      x: 567.799,
      y: 573.75,
      w: 454.349,
      h: 390.274,
      transform: "rotate(3.46218 567.799 573.75)",
    },

    // Right rotated
    {
      x: 1053.26,
      y: 592.283,
      w: 203.431,
      h: 401.634,
      transform: "rotate(-7.01904 1053.26 592.283)",
    },

    // Bottom row
    { x: 196.75, y: 1081.75, w: 381, h: 301 },
    { x: 940.75, y: 1020.75, w: 363, h: 301 },
    { x: 601.75, y: 1020.75, w: 315, h: 168 },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg viewBox="0 0 1521 2117" style={{ width: "100%", height: "100%" }}>
        <Layout8SVG />

        {slots.map((slot, index) => {
          const letter = letters[index];
          if (!letter) return null;

          const centerX = slot.x + slot.w / 2;
          const centerY = slot.y + slot.h / 2;

          // 🎨 Pick random color for this letter
          const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

          const text = (
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
