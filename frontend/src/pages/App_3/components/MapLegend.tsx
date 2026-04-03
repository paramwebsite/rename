import React from "react";
import { THEME } from "../constants";

const MapLegend: React.FC = () => {
  return (
    <div
      className="absolute bottom-4 left-4/24 z-30 pointer-events-none select-none
                 bg-[#f4e4bc]/95 border-2 border-[#5d4037] shadow-xl
                 rounded-sm px-3 py-2 w-[250px]"
      style={{ fontFamily: "'IM Fell English', serif" }}
    >
      <h3
        className="text-[15px] uppercase tracking-widest font-bold text-[#5d4037] mb-2 border-b border-[#5d4037]/30 pb-1"
        style={{ fontFamily: "'IM Fell English SC', serif" }}
      >
        Map Key
      </h3>

      <div className="space-y-2 text-[#5d4037] text-[15px] leading-snug">
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 border border-[#5d4037] shrink-0"
            style={{ backgroundColor: THEME.land }}
          />
          <span>Other countries</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 border border-[#5d4037] shrink-0"
            style={{ backgroundColor: THEME.highlightSecondary }}
          />
          <span>Name is present here</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 border border-[#5d4037] shrink-0"
            style={{ backgroundColor: THEME.highlight }}
          />
          <span>Top 3 popularity countries</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 border border-[#5d4037] shrink-0"
            style={{ backgroundColor: THEME.highlightOrigin }}
          />
          <span>Origin country of the name</span>
        </div>

        {/* <p className="pt-1 text-[10px] italic text-[#5d4037]/80">
          Floating cards show rank, popularity ratio, and estimated people.
        </p> */}
      </div>
    </div>
  );
};

export default MapLegend;