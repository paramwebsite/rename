import { useState } from "react";

export default function InputScreen({ onSubmit }) {
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_700px_at_30%_20%,#1a1f2b,#0b0f16)] px-[18px] py-[18px] font-sans text-[#eaf0ff] flex items-center justify-center">
      <div className="w-[min(520px,95vw)] rounded-[18px] border border-white/10 bg-white/5 p-[22px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-[10px]">
        <div className="mb-3 text-[22px] font-bold">
          Name → Scientific Formula Engine
        </div>

        <div className="mb-[18px] opacity-75">
          Type a name. We’ll translate it into a physically-plausible chalk formula.
        </div>

        {/* <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name…"
          className="mb-3 w-full rounded-xl border border-white/15 bg-black/30 px-[14px] py-[14px] text-white outline-none text-[16px]"
        />

        <button
          onClick={() => onSubmit(name)}
          disabled={!name.trim()}
          title={!name.trim() ? "Enter a name first" : "Generate formula"}
          className={[
            "w-full rounded-xl border border-white/15 px-[14px] py-3 font-extrabold text-white transition",
            "bg-[linear-gradient(180deg,rgba(135,200,255,0.35),rgba(70,140,255,0.22))]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:brightness-110 active:brightness-95",
          ].join(" ")}
        >
          Generate Formula
        </button> */}

        <div className="mt-[14px] text-[12px] opacity-55">
          Greedy matching: trigraphs → digraphs → single letters.
        </div>
      </div>
    </div>
  );
}