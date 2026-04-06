import React from "react";
import Layout7SVG from "./Layout7SVG";
const COLORS = ["#FE47C6", "#70FE99", "#7A5BFE"];
export default function NameLayout7({ name }) {
  const letters = name.toLowerCase().split("");

  // EXACT rectangles from your SVG
  const slots = [
    // Top row
    { x: 386.75, y: 169.75, w: 334, h: 368 },
    { x: 754.75, y: 169.75, w: 372, h: 368 },

    // Middle rotated left
    {
      x: 263.072,
      y: 537.75,
      w: 437.849,
      h: 380.737,
      transform: "rotate(6.53363 263.072 537.75)",
    },

    // Middle rotated right
    {
      x: 720.322,
      y: 616.864,
      w: 479.918,
      h: 356.038,
      transform: "rotate(-7.01904 720.322 616.864)",
    },

    // Bottom row
    { x: 173.75, y: 989.75, w: 419, h: 301 },
    { x: 628.75, y: 990.75, w: 260, h: 218 },
    { x: 940.75, y: 976.75, w: 389, h: 387 },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg viewBox="0 0 1521 2117" style={{ width: "100%", height: "100%" }}>
        <Layout7SVG />

        {/* {slots.map((slot, index) => {
          const letter = letters[index];
          if (!letter) return null;

          const centerX = slot.x + slot.w / 2;
          const centerY = slot.y + slot.h / 2 -70;
           // 🎨 Pick random color for this letter
          const randomColor =
            COLORS[Math.floor(Math.random() * COLORS.length)];

          const textElement = (
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Megazoid"
              fontSize="270"
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
        })} */}
        {slots.map((slot, index) => {
          const letter = letters[index];
          if (!letter) return null;

          const centerX = slot.x + slot.w / 2;

          // move only 6th letter a little upward
          const yOffset = index === 5 ? -35 : 0;
          const centerY = slot.y + slot.h / 2 + yOffset;

          const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

          const textElement = (
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Megazoid"
              fontSize="270"
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
