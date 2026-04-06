import React from "react";
import Layout10SVG from "./Layout10SVG";
const COLORS = ["#FE47C6", "#70FE99", "#7A5BFE"];

export default function NameLayout10({ name }) {
  const letters = name.toLowerCase().split("");

  // Exact rectangle definitions from your SVG
  const slots = [
    // Top row
    { x: 386.75, y: 169.75, w: 334, h: 368 },
    { x: 754.75, y: 169.75, w: 372, h: 368 },

    // Rotated group
    {
      x: 272.751,
      y: 552.75,
      w: 288,
      h: 453,
      transform: "rotate(12.7532 272.751 552.75)",
    },
    {
      x: 567.799,
      y: 573.75,
      w: 226.954,
      h: 232.639,
      transform: "rotate(3.46218 567.799 573.75)",
    },
    {
      x: 810.799,
      y: 567.75,
      w: 226.954,
      h: 298.251,
      transform: "rotate(3.46218 810.799 567.75)",
    },
    {
      x: 1053.26,
      y: 592.283,
      w: 203.431,
      h: 401.634,
      transform: "rotate(-7.01904 1053.26 592.283)",
    },

    // Middle
    { x: 196.75, y: 1081.75, w: 381, h: 301 },
    {
      x: 305.157,
      y: 1419.34,
      w: 232.554,
      h: 370.08,
      transform: "rotate(-3.10286 305.157 1419.34)",
    },

    // Bottom
    { x: 602.75, y: 907.75, w: 331, h: 301 },
    { x: 973.75, y: 1020.75, w: 359, h: 326 },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg viewBox="0 0 1521 2117" style={{ width: "100%", height: "100%" }}>
        <Layout10SVG />

        {slots.map((slot, index) => {
          const letter = letters[index];
          if (!letter) return null;

          const centerX = slot.x + slot.w / 2;
          const centerY = slot.y + slot.h / 2 -70;
          // 🎨 Pick random color for this letter
          const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

          const textElement = (
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Megazoid"
              fontSize="260"
              fill={randomColor}
              className="display2-text"
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
