import * as React from "react";

export const LAYOUT5_BOXES = [
  {
    id: "box-1",
    x: 286.75,
    y: 69.75,
    w: 434,
    h: 468,
  },
  {
    id: "box-2",
    x: 754.75,
    y: 69.75,
    w: 472,
    h: 468,
  },
  {
    id: "box-3",
    x: 163.951,
    y: 658.535,
    w: 464.237,
    h: 613.676,
    transform: "rotate(4.16948 263.951 658.535)",
  },
  {
    id: "box-4",
    x: 652.75,
    y: 672.75,
    w: 364,
    h: 417,
  },
  {
    id: "box-5",
    x: 990.319,
    y: 815.156,
    w: 342.378,
    h: 487,
    transform: "rotate(-14.3472 940.319 715.156)",
  },
];

const SVGComponent = (props) => (
  <svg
    width={1521}
    height={2117}
    viewBox="0 0 1521 2117"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <image
      href="/background.svg"
      x="0"
      y="0"
      width="1521"
      height="2117"
      preserveAspectRatio="xMidYMid slice"
    />
    <path
      d="M387.149 129.871H1130.67L1440.27 1081.71L1130.67 2033.07H917.549V1383.15"
      stroke="black"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M917.069 1383.15L916.589 1370.67L915.149 1358.19L912.749 1345.71L909.389 1333.71L905.069 1322.19L899.789 1310.67L893.549 1300.11L886.829 1289.55L878.669 1279.47L870.509 1270.35L861.389 1262.19L851.309 1254.03L840.749 1247.31L830.189 1241.07L818.669 1235.79L807.149 1231.47L795.149 1228.11L782.669 1225.71L770.189 1224.27L757.709 1223.79"
      stroke="black"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M751.95 1223.79H757.71"
      stroke="black"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M751.949 1223.79L739.469 1224.27L726.989 1225.71L714.509 1228.11L702.509 1231.47L690.989 1235.79L679.469 1241.07L668.909 1247.31L658.349 1254.03L648.269 1262.19L639.149 1270.35L630.989 1279.47L622.829 1289.55L616.109 1300.11L609.869 1310.67L604.589 1322.19L600.269 1333.71L596.909 1345.71L594.509 1358.19L593.069 1370.67L592.589 1383.15"
      stroke="black"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M592.11 1383.15V2033.07H387.15L73.71 1081.71L387.15 129.87M938.19 2033.07V2115.63H1174.83L1519.47 1058.19L1174.83 0.75H349.23L0.75 1058.19L349.23 2115.63H576.75V2033.07"
      stroke="black"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {LAYOUT5_BOXES.map((box) => {
      const rect = (
        <rect
          x={box.x}
          y={box.y}
          width={box.w}
          height={box.h}
          fill="#D9D9D9"
          display="none"
        />
      );

      return box.transform ? (
        <g key={box.id} transform={box.transform}>
          {rect}
        </g>
      ) : (
        <g key={box.id}>{rect}</g>
      );
    })}
  </svg>
);

export default SVGComponent;