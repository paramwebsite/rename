import { useMemo, useState, useEffect, useRef } from "react";





const PATTERNS = [
  { key: "sha", out: ["σ_h", "sinh(a)"], desc: "Shear stress or hyperbolic sine." },
  { key: "shi", out: ["sinh(i)", "σ_i"], desc: "Hyperbolic sine or sigma index." },
  { key: "sh", out: ["σ", "∫"], desc: "Sigma summation or integral flow." },
  { key: "kri", out: ["K_r,i", "κ_r(i)"], desc: "Curvature or indexed constant." },
  { key: "dev", out: ["ΔV", "∇·E"], desc: "Change in volume or divergence." },
  { key: "raj", out: ["r_aj", "R_a·J"], desc: "Radius index or resistance-current." },
  { key: "rah", out: ["r_h", "ρ_h"], desc: "Radius height or density index." },
  { key: "ram", out: ["r·a·m", "m·a"], desc: "Radius-times-acceleration or force core." },
  { key: "kam", out: ["k·m", "K_m"], desc: "Spring-mass pairing or constant." },
  { key: "kal", out: ["k_ℓ", "K_L"], desc: "Length-scale constant." },
  { key: "tan", out: ["tan(θ)", "sin(θ)/cos(θ)"], desc: "Tangent angle or sin over cos." },
  { key: "sin", out: ["sin(θ)", "Im(e^{iθ})"], desc: "Sine wave or imaginary exponential." },
  { key: "cos", out: ["cos(θ)", "Re(e^{iθ})"], desc: "Cosine wave or real exponential." },
  { key: "sec", out: ["sec(θ)", "1/cos(θ)"], desc: "Secant angle or inverse cosine." },
  { key: "csc", out: ["csc(θ)", "1/sin(θ)"], desc: "Cosecant angle or inverse sine." },
  { key: "cot", out: ["cot(θ)", "cos(θ)/sin(θ)"], desc: "Cotangent or cos over sin." },

  { key: "aa", out: ["a^2", "αα"], desc: "Squared amplitude or twin alpha." },
  { key: "ee", out: ["E_e", "e^e"], desc: "Electric field index or exponential growth." },
  { key: "oo", out: ["∞", "O_0"], desc: "Infinity loop or base state." },
  { key: "th", out: ["θ", "∴"], desc: "Theta angle or therefore." },
  { key: "ph", out: ["φ", "Φ"], desc: "Phase angle or flux." },
  { key: "ch", out: ["χ", "c·h"], desc: "Chi variable or light-times-Planck." },
  { key: "kh", out: ["k_h", "κ_h"], desc: "Height constant or curvature index." },
  { key: "dh", out: ["dH", "Δh"], desc: "Enthalpy change or height change." },
  { key: "bh", out: ["B·h", "β_h"], desc: "Magnetic-height term or beta index." },
  { key: "gh", out: ["g·h", "ΔU"], desc: "Gravitational potential step." },
  { key: "ng", out: ["η_g", "n·g"], desc: "Efficiency index or density-gravity." },
  { key: "st", out: ["s·t", "∫dt"], desc: "Distance-time pair or time integral." },
  { key: "pr", out: ["P_r", "p·r"], desc: "Pressure-radius or Prandtl style index." },
  { key: "ra", out: ["r_a", "R_a"], desc: "Radius-at-a or resistance index." },
  { key: "ma", out: ["m·a", "F"], desc: "Force core: mass times acceleration." },
  { key: "ka", out: ["k_a", "κ_a"], desc: "Spring/curvature constant at a." },
  { key: "ya", out: ["y_a", "γ_a"], desc: "Y-position or gamma index." },
  { key: "na", out: ["N_A", "n_a"], desc: "Avogadro constant or amount index." },
  { key: "la", out: ["λ", "L_a"], desc: "Wavelength or length index." },
  { key: "ri", out: ["r_i", "R_i"], desc: "Inner radius or resistance index." },
  { key: "vi", out: ["v_i", "V_i"], desc: "Initial velocity or initial voltage." },
  { key: "li", out: ["ℓ_i", "L_i"], desc: "Length element or inductance index." },
  { key: "an", out: ["a_n", "∠n"], desc: "Nth acceleration or angle marker." },
  { key: "ar", out: ["a_r", "r"], desc: "Radial acceleration or radius." },
  { key: "sa", out: ["s_a", "σ_a"], desc: "Path coordinate or sigma index." },
  { key: "ha", out: ["h_a", "ℏ"], desc: "Height index or reduced Planck." },
  { key: "ta", out: ["τ_a", "t_a"], desc: "Time constant or time index." },

  { key: "force", out: ["F", "m·a"], desc: "Force or mass-acceleration form." },
  { key: "energy", out: ["E", "m c^2"], desc: "Energy core or relativistic form." },
  { key: "power", out: ["P", "F·v"], desc: "Power or force-velocity transfer." },
  { key: "work", out: ["W", "∫F·ds"], desc: "Work or force along path." },
  { key: "heat", out: ["Q", "m c_p ΔT"], desc: "Heat or calorimetry form." },
  { key: "mass", out: ["m", "ρV"], desc: "Mass or density-volume form." },
  { key: "wave", out: ["λ", "f^{-1}c"], desc: "Wavelength or c over frequency." },

  { key: "c", out: ["c", "3×10^8"], desc: "Speed of light constant." },
  { key: "g", out: ["g", "9.8"], desc: "Gravity constant." },
  { key: "h", out: ["h", "ℏ"], desc: "Planck constant or reduced Planck." },
  { key: "kb", out: ["k_B"], desc: "Boltzmann constant." },
  { key: "r", out: ["R", "r"], desc: "Gas constant or radius." },
  { key: "e", out: ["e", "E"], desc: "Euler base or electric field." },
  { key: "pi", out: ["π"], desc: "Pi, circular ratio." },
  { key: "mu", out: ["μ", "μ0"], desc: "Micro/viscosity or permeability." },
  { key: "eps", out: ["ε", "ε0"], desc: "Permittivity or small error." },

  { key: "alpha", out: ["α"], desc: "Alpha: origin, self, first principle." },
  { key: "beta", out: ["β"], desc: "Beta: growth, response factor." },
  { key: "gamma", out: ["γ"], desc: "Gamma: energy scale or relativity factor." },
  { key: "delta", out: ["Δ"], desc: "Delta: change or difference." },
  { key: "theta", out: ["θ"], desc: "Theta: angle or phase." },
  { key: "lambda", out: ["λ"], desc: "Lambda: wavelength or eigen-parameter." },
  { key: "sigma", out: ["σ", "∑"], desc: "Sigma: stress or summation." },
  { key: "phi", out: ["φ", "Φ"], desc: "Phi: phase or flux." },
  { key: "omega", out: ["Ω", "ω"], desc: "Omega: resistance or angular frequency." },
  { key: "tau", out: ["τ"], desc: "Tau: time constant." },
  { key: "rho", out: ["ρ"], desc: "Rho: density." },
  { key: "eta", out: ["η"], desc: "Eta: efficiency or viscosity." },
  { key: "kappa", out: ["κ"], desc: "Kappa: curvature or conductivity." },
  { key: "chi", out: ["χ"], desc: "Chi: susceptibility." },
  { key: "psi", out: ["ψ"], desc: "Psi: wavefunction." },
  { key: "zeta", out: ["ζ"], desc: "Zeta: damping ratio." },

  { key: "a", out: ["a", "α"], desc: "Acceleration or alpha origin." },
  { key: "b", out: ["b", "β"], desc: "Field term or beta response." },
  { key: "d", out: ["d", "Δ"], desc: "Differential or change." },
  { key: "f", out: ["f", "F"], desc: "Frequency or force." },
  { key: "i", out: ["i", "I"], desc: "Index or current." },
  { key: "j", out: ["J"], desc: "Joule or current density." },
  { key: "k", out: ["k", "κ"], desc: "Spring constant or curvature." },
  { key: "l", out: ["ℓ", "L"], desc: "Length or inductance." },
  { key: "m", out: ["m"], desc: "Mass term." },
  { key: "n", out: ["n", "N"], desc: "Count or normal force marker." },
  { key: "o", out: ["Ω", "o"], desc: "Resistance symbol or placeholder." },
  { key: "p", out: ["p", "P"], desc: "Momentum or power." },
  { key: "q", out: ["q", "Q"], desc: "Charge or heat." },
  { key: "s", out: ["s", "σ"], desc: "Displacement or stress." },
  { key: "t", out: ["t", "τ"], desc: "Time or time constant." },
  { key: "u", out: ["u", "μ"], desc: "Potential energy baseline or mu." },
  { key: "v", out: ["v", "V"], desc: "Velocity or voltage." },
  { key: "w", out: ["W", "ω"], desc: "Work or angular frequency." },
  { key: "x", out: ["x"], desc: "Position axis." },
  { key: "y", out: ["y", "γ"], desc: "Y-axis or gamma scale." },
  { key: "z", out: ["z", "ζ"], desc: "Z-axis or damping ratio." },
];

const GENERATED_SYLLABLES = [
  "ab","ad","ag","ak","al","am","an","ar","as","at","av","ay",
  "ba","be","bi","bo","bu","by",
  "ca","ce","ci","co","cu","cy",
  "da","de","di","do","du",
  "ea","el","em","en","er","es","et",
  "fa","fi","fo","ga","ge","gi","go",
  "ia","il","im","in","ir","is","it",
  "ja","je","ji","jo",
  "ki","ko","ku",
  "le","lo","lu",
  "me","mi","mo","mu",
  "ne","ni","no","nu",
  "ol","om","on","or","os","ot",
  "pa","pe","pi","po","pu",
  "re","ro","ru",
  "se","si","so","su",
  "te","ti","to","tu",
  "ul","um","un","ur",
  "va","ve","vo","wa","wi","ya","yo","za","ze","zi","zo"
];

function buildGeneratedEntries() {
  const picks = [];
  for (const syl of GENERATED_SYLLABLES) {
    const c = syl[0];
    let out;
    let desc;

    if ("aeiou".includes(c)) {
      out = [`${syl[0]}_${syl[1]}`, `e^{${syl[0]}}`];
      desc = "Indexed state or exponential mode.";
    } else if (c === "p") {
      out = ["p", "P", "p·v"];
      desc = "Momentum/power style coupling.";
    } else if (c === "v") {
      out = ["v_" + syl[1], "V_" + syl[1]];
      desc = "Velocity/voltage indexed component.";
    } else if (c === "m") {
      out = ["m_" + syl[1], "μ_" + syl[1]];
      desc = "Mass or mu-index term.";
    } else if (c === "s") {
      out = ["s_" + syl[1], "σ_" + syl[1]];
      desc = "Displacement or stress index.";
    } else if (c === "t") {
      out = ["t_" + syl[1], "τ_" + syl[1]];
      desc = "Time marker or time constant.";
    } else if (c === "r") {
      out = ["[" + "r_" + syl[1] + "]".replace("[", "").replace("]", ""), "R_" + syl[1]];
      desc = "Radius or resistance index.";
    } else if (c === "k") {
      out = ["k_" + syl[1], "κ_" + syl[1]];
      desc = "Constant or curvature index.";
    } else if (c === "d") {
      out = ["Δ" + syl[1], "d" + syl[1]];
      desc = "Change term or differential marker.";
    } else if (c === "c") {
      out = ["c_" + syl[1], "cos(θ)"];
      desc = "Constant index or cosine anchor.";
    } else if (c === "g") {
      out = ["g_" + syl[1], "γ_" + syl[1]];
      desc = "Gravity index or gamma scale.";
    } else if (c === "b") {
      out = ["β_" + syl[1], "B_" + syl[1]];
      desc = "Beta response or field component.";
    } else {
      out = [`${c}_${syl[1]}`, `${c}·${syl[1]}`];
      desc = "Indexed variable or simple product coupling.";
    }

    picks.push({ key: syl, out, desc });
  }
  return picks;
}

const FULL_BANK = [...PATTERNS, ...buildGeneratedEntries()];


function hashString(str) {
  // deterministic small hash for repeatable symbol choices
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function isAlphaNumOrGreek(ch) {
  // used for joining formula tokens
  return /[A-Za-z0-9α-ωΑ-ΩℓμτΔΩπσθλγβ]/.test(ch);
}


function ChalkCanvas({ textLines, isActive, onDone }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const stateRef = useRef({
    lineIndex: 0,
    charIndex: 0,
    done: false,
  });

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stateRef.current = { lineIndex: 0, charIndex: 0, done: false };

    const chalkColor = "rgba(245,245,245,0.92)";

    function clear() {
      ctx.clearRect(0, 0, rect.width, rect.height);
    }

    function drawChalkText(partialLines) {
      clear();

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowColor = "rgba(255,255,255,0.25)";
      ctx.shadowBlur = 2;

      partialLines.forEach((ln, idx) => {
        const y = 110 + idx * 54;

        // This is still the right place for it (canvas, not CSS)
        ctx.font = "64px 'Patrick Hand', 'Comic Sans MS', system-ui";
        ctx.fillStyle = chalkColor;

        const jitterX = (Math.random() - 0.5) * 1.4;
        const jitterY = (Math.random() - 0.5) * 1.0;

        ctx.fillText(ln, 70 + jitterX, y + jitterY);

        const specks = 70;
        for (let s = 0; s < specks; s++) {
          const x = 70 + Math.random() * (rect.width - 140);
          const yy = y - 28 + Math.random() * 40;
          ctx.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.06})`;
          ctx.fillRect(x, yy, 1, 1);
        }

        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(70, y + 10, rect.width - 140, 1);
      });

      ctx.restore();
    }

    function step() {
      const st = stateRef.current;
      if (st.done) return;

      const fullLines = textLines;
      const rendered = [];

      for (let li = 0; li < fullLines.length; li++) {
        if (li < st.lineIndex) rendered.push(fullLines[li]);
        else if (li === st.lineIndex) rendered.push(fullLines[li].slice(0, Math.floor(st.charIndex)));
        else rendered.push("");
      }

      drawChalkText(rendered);

      const current = fullLines[st.lineIndex] || "";
      const speed = 0.6;
      st.charIndex += speed;

      if (st.charIndex >= current.length) {
        st.lineIndex += 1;
        st.charIndex = 0;
        if (st.lineIndex >= fullLines.length) {
          st.done = true;
          onDone?.();
          return;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [textLines, isActive, onDone]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}

function compileNameToFormula(nameRaw) {
  const name = (nameRaw || "").trim().toLowerCase();
  const cleaned = name.replace(/[^a-z]/g, "");
  const seed = hashString(cleaned);

  const patterns = FULL_BANK.slice().sort((a, b) => b.key.length - a.key.length);

  const tokens = [];
  const interpretations = [];

  let i = 0;
  while (i < cleaned.length) {
    let matched = null;

    for (const p of patterns) {
      if (cleaned.startsWith(p.key, i)) {
        matched = p;
        break;
      }
    }

    if (!matched) {
      const ch = cleaned[i];
      tokens.push(ch);
      interpretations.push({ chunk: ch, out: ch, desc: "Symbol placeholder." });
      i += 1;
      continue;
    }

    const alts = Array.isArray(matched.out) ? matched.out : [matched.out];
    const pickIndex = (seed + i * 131) % alts.length;
    const chosen = alts[pickIndex];

    tokens.push(chosen);
    interpretations.push({ chunk: matched.key, out: chosen, desc: matched.desc });

    i += matched.key.length;
  }

  let formula = "";
  for (let t = 0; t < tokens.length; t++) {
    const cur = tokens[t];
    const prev = formula.trimEnd();
    const prevLast = prev.length ? prev[prev.length - 1] : "";
    const curFirst = cur.length ? cur[0] : "";

    const needsDot =
      prevLast &&
      isAlphaNumOrGreek(prevLast) &&
      isAlphaNumOrGreek(curFirst) &&
      curFirst !== "(";

    formula += (t === 0 ? "" : needsDot ? "·" : "") + cur;
  }

  const pretty = formula.length > 18 ? `ℱ(${nameRaw.trim()}) = ${formula}` : formula;
  return { cleaned, formula: pretty, interpretations };
}

export default  function ResultScreen({ name, onBack }) {
  const compiled = useMemo(() => compileNameToFormula(name), [name]);
  const chalkLines = [compiled.formula];
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_700px_at_30%_20%,#1a1f2b,#0b0f16)] px-[18px] py-[18px] font-sans text-[#eaf0ff] flex items-center justify-center">
      <div className="w-[min(980px,96vw)] flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-2.5 px-1 py-2">
          <button
            onClick={onBack}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 font-bold text-white hover:bg-white/10 active:bg-white/5"
          >
            ← Back
          </button>

          <div className="font-bold opacity-85">
            Result for: <span className="opacity-100">{name}</span>
          </div>

          <div className="w-[88px]" />
        </div>

        <div className="relative mx-auto aspect-square w-[min(80vmin,720px)] overflow-hidden rounded-[18px] border-[6px] border-[#5b3a1e] shadow-[0_25px_80px_rgba(0,0,0,0.6)] bg-[#1f4f2f] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.04),transparent_45%)]">
          <div className="absolute inset-0 p-[60px]">
            <ChalkCanvas
              textLines={chalkLines}
              isActive={true}
              onDone={() => {
                setDone(true);
              }}
            />
          </div>

          {/* Kept behavior (done) even though footer is commented out in original */}
          <span className="sr-only">{done ? "Chalk complete." : "Writing…"}</span>
        </div>

        <div className="mx-auto w-[min(820px,96vw)] rounded-[18px] border border-white/10 bg-white/5 p-[18px] backdrop-blur-[10px]">
          <div className="mb-2 font-extrabold">Full interpretation</div>
          <div className="mb-2.5 opacity-75">
            Every matched chunk → chosen scientific symbol → meaning.
          </div>

          <div className="mt-2.5 overflow-hidden rounded-[14px] border border-white/10">
            <div className="grid grid-cols-[110px_200px_1fr] bg-white/10 px-3 py-2.5 text-[13px] font-extrabold">
              <div>Chunk</div>
              <div>Symbol</div>
              <div>Meaning</div>
            </div>

            {compiled.interpretations.slice(0, 18).map((it, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[110px_200px_1fr] items-start border-t border-white/10 px-3 py-2.5 text-[13px]"
              >
                <div className="font-mono opacity-90">{it.chunk}</div>
                <div className="font-mono opacity-90">{it.out}</div>
                <div className="opacity-80">{it.desc}</div>
              </div>
            ))}

            {compiled.interpretations.length > 18 && (
              <div className="px-3 pb-3 pt-2 text-[12px] opacity-60">
                (Showing first 18 chunks)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}