import React, { useLayoutEffect, useRef, useState } from "react";
import Layout5SVG, { LAYOUT5_BOXES } from "./Layout5SVG";

const COLORS = ["#FE47C6", "#70FE99", "#7A5BFE"];

const getLetterColor = (index) => COLORS[index % COLORS.length];

function ResponsiveLetter({ letter, box, color }) {
  const textRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (!textRef.current || !letter) return;

    const bbox = textRef.current.getBBox();
    if (!bbox.width || !bbox.height) return;

    const paddingX = box.w * 0.00;
    const paddingY = box.h * 0.00;

    const availableWidth = box.w - paddingX * 2;
    const availableHeight = box.h - paddingY * 2;

    const scaleX = availableWidth / bbox.width;
    const scaleY = availableHeight / bbox.height;

    setScale(Math.min(scaleX, scaleY));
  }, [letter, box.w, box.h]);

  const centerX = box.x + box.w / 2;
  const centerY = box.y + box.h / 2;

  return (
    <g>
      <text
        ref={textRef}
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Megazoid"
        fontSize="100"
        fill={color}
        className="display2-text"
        visibility="hidden"
      >
        {letter}
      </text>

      <g transform={`translate(${centerX} ${centerY}) scale(${scale})`}>
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Megazoid"
          fontSize="100"
          fill={color}
          className="display2-text"
        >
          {letter}
        </text>
      </g>
    </g>
  );
}

export default function NameLayout5({ name = "" }) {
  const letters = name.toLowerCase().split("").slice(0, LAYOUT5_BOXES.length);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg viewBox="0 0 1521 2117" style={{ width: "100%", height: "100%" }}>
        <Layout5SVG />

        {LAYOUT5_BOXES.map((box, index) => {
          const letter = letters[index];
          if (!letter) return null;

          const content = (
            <ResponsiveLetter
              letter={letter}
              box={box}
              color={getLetterColor(index)}
            />
          );

          return box.transform ? (
            <g key={box.id} transform={box.transform}>
              {content}
            </g>
          ) : (
            <g key={box.id}>{content}</g>
          );
        })}
      </svg>
    </div>
  );
}