import React from "react";
import { CountryPopularity, OriginData } from "../types";
import { THEME } from "../constants";

interface LegendOverlayProps {
  data: CountryPopularity | OriginData | { message: string };
  rank?: number;
  isOrigin?: boolean;
}

const LegendOverlay: React.FC<LegendOverlayProps> = ({
  data,
  rank,
  isOrigin,
}) => {
  // Case for Fallback message
  if ("message" in data) {
    return (
      <div
        className="p-4 shadow-2xl border-4 border-[#5d4037] pointer-events-none select-none w-[320px] rounded-sm relative bg-[#f4e4bc] text-center flex items-center justify-center min-h-[80px]"
        style={{ fontFamily: "'IM Fell English', serif" }}
      >
        <p className="text-[#5d4037] text-sm italic leading-tight">
          "{data.message}"
        </p>
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#5d4037]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#5d4037]"></div>
      </div>
    );
  }

  const isMeaningful = "meaning" in data;
  const isPopData = "estimated_population" in data;

  return (
    <div
      className="p-2 shadow-xl border-2 border-[#5d4037] pointer-events-none select-none w-[140px] h-[80px] rounded-sm relative flex flex-col justify-center overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: isOrigin
          ? "rgba(46, 51, 138,0.5)" // origin
          : "rgba(138, 59, 46,0.5)", // normal

        color: THEME.legendText,
        fontFamily: "'IM Fell English', serif",
        backdropFilter: "blur(0.1px)",
        border: "2px solid rgba(93, 64, 55, 0.7)",
      }}
    >
      <div className="flex items-start justify-between border-b border-opacity-30 border-white pb-0.5 mb-1">
        <h4
          className="text-[10px] font-bold uppercase tracking-wide leading-tight pr-1 truncate"
          style={{ fontFamily: "'IM Fell English SC', serif" }}
        >
          {data.country_name}
        </h4>
        <div className="flex gap-1 flex-shrink-0">
          {isOrigin && (
            <span className="text-[8px] bg-white/20 text-white px-1 py-0 rounded-sm font-bold italic tracking-tighter">
              Origin
            </span>
          )}
          {rank !== undefined && (
            <span className="text-[8px] bg-[#f4e4bc] text-[#5d4037] px-1 py-0 rounded-full font-bold shadow-inner font-sans [font-variant-numeric:lining-nums]">
              #{rank}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-0 leading-tight overflow-hidden">
        {isMeaningful && (
          <p className="text-[8px] line-clamp-1">
            Meaning: <span className="opacity-100">{data.meaning}</span>
          </p>
        )}
        <p className="text-[9px] opacity-95 truncate">
          Popularity:{" "}
          <span className="font-sans [font-variant-numeric:lining-nums]">
            {data?.ratio?.replace(":", " in ")}
          </span>
        </p>
        {isPopData && (
          <p className="text-[10px] text-white">
            Est.{" "}
            <span className="font-sans [font-variant-numeric:lining-nums]">
              {data.estimated_population}
            </span>{" "}
            People
          </p>
        )}
      </div>

      {/* <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-black/20 rounded-full border border-white/10 blur-[0.4px]"></div> */}
    </div>
  );
};

export default LegendOverlay;
