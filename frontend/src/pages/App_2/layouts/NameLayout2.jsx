import React from "react";
import Layout2SVG from "./Layout2SVG";

export default function NameLayout2({ name }) {
  const letters = name.toLowerCase().split("");
  const COLORS = ["#FE47C6", "#70FE99", "#7A5BFE"];

  const slots = [
    {
      x: 387.234,
      y: 170.75,
      w: 546.489,
      h: 474.296,
      transform: "rotate(4.16948 387.234 170.75)"
    },
    {
      x: 578.605,
      y: 778.491,
      w: 642.752,
      h: 423.321,
      transform: "rotate(-11.6969 578.605 778.491)"
    }
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg
        viewBox="0 0 1521 2117"
        style={{ width: "100%", height: "100%" }}
      >
        <Layout2SVG />

        {letters.map((letter, index) => {
          if (!slots[index]) return null;

          const slot = slots[index];

          const centerX = slot.x + slot.w / 2;
          const centerY = slot.y + slot.h / 2;

          // Auto scale font based on rectangle height
          const fontSize = slot.h * 0.8;
               const randomColor =
            COLORS[Math.floor(Math.random() * COLORS.length)];
          return (
            <g key={index} transform={slot.transform}>
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Megazoid"
                fontSize={fontSize}
                fill={randomColor}
              >
                {letter}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
