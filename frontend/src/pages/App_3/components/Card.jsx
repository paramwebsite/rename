import React from "react";

export default function Card({ lang, value, color, active, sizeType }) {
  const sizeStyles = {
    small: { fontSize: "12px", padding: "4px 8px", borderRadius: "6px" },
    medium: { fontSize: "14px", padding: "6px 12px", borderRadius: "8px" },
    large: { fontSize: "16px", padding: "8px 16px", borderRadius: "10px" },
  };

  const style = {
    ...sizeStyles[sizeType],
    background: active ? color.bg : "#1a1a1a",
    color: active ? color.text : "#444",
    border: "1px solid rgba(255,255,255,0.1)",
    fontFamily: "system-ui, sans-serif",
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    lineHeight: 1.3,
    flexShrink: 0,
    transition:
      "background 0.8s ease-in-out, color 0.8s ease-in-out, opacity 0.8s ease-in-out, transform 0.8s ease",
    opacity: active ? 1 : 0.6,
    transform: active ? "scale(1)" : "scale(0.96)",
  };

  return (
    <div className="card" style={style}>
      <span style={{ fontWeight: 600, marginRight: 6 }}>{value}</span>
      <span style={{ fontSize: "11px", fontWeight: 700, opacity: 0.8 }}>
        {lang.replace(/ *\([^)]*\) */g, "")}
      </span>
    </div>
  );
}
