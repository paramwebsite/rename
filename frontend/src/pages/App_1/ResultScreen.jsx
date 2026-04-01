import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const PATTERNS = [
  {
    key: "sha",
    out: ["σ_h", "sinh(a)"],
    desc: "Shear stress or hyperbolic sine.",
  },
  {
    key: "shi",
    out: ["sinh(i)", "σ_i"],
    desc: "Hyperbolic sine or sigma index.",
  },
  { key: "sh", out: ["σ", "∫"], desc: "Sigma summation or integral flow." },
  {
    key: "kri",
    out: ["K_r,i", "κ_r(i)"],
    desc: "Curvature or indexed constant.",
  },
  { key: "dev", out: ["ΔV", "∇·E"], desc: "Change in volume or divergence." },
  {
    key: "raj",
    out: ["r_aj", "R_a·J"],
    desc: "Radius index or resistance-current.",
  },
  { key: "rah", out: ["r_h", "ρ_h"], desc: "Radius height or density index." },
  {
    key: "ram",
    out: ["r·a·m", "m·a"],
    desc: "Radius-times-acceleration or force core.",
  },
  { key: "kam", out: ["k·m", "K_m"], desc: "Spring-mass pairing or constant." },
  { key: "kal", out: ["k_ℓ", "K_L"], desc: "Length-scale constant." },
  {
    key: "tan",
    out: ["tan(θ)", "sin(θ)/cos(θ)"],
    desc: "Tangent angle or sin over cos.",
  },
  {
    key: "sin",
    out: ["sin(θ)", "Im(e^{iθ})"],
    desc: "Sine wave or imaginary exponential.",
  },
  {
    key: "cos",
    out: ["cos(θ)", "Re(e^{iθ})"],
    desc: "Cosine wave or real exponential.",
  },
  {
    key: "sec",
    out: ["sec(θ)", "1/cos(θ)"],
    desc: "Secant angle or inverse cosine.",
  },
  {
    key: "csc",
    out: ["csc(θ)", "1/sin(θ)"],
    desc: "Cosecant angle or inverse sine.",
  },
  {
    key: "cot",
    out: ["cot(θ)", "cos(θ)/sin(θ)"],
    desc: "Cotangent or cos over sin.",
  },

  { key: "aa", out: ["a^2", "αα"], desc: "Squared amplitude or twin alpha." },
  {
    key: "ee",
    out: ["E_e", "e^e"],
    desc: "Electric field index or exponential growth.",
  },
  { key: "oo", out: ["∞", "O_0"], desc: "Infinity loop or base state." },
  { key: "th", out: ["θ", "∴"], desc: "Theta angle or therefore." },
  { key: "ph", out: ["φ", "Φ"], desc: "Phase angle or flux." },
  { key: "ch", out: ["χ", "c·h"], desc: "Chi variable or light-times-Planck." },
  {
    key: "kh",
    out: ["k_h", "κ_h"],
    desc: "Height constant or curvature index.",
  },
  { key: "dh", out: ["dH", "Δh"], desc: "Enthalpy change or height change." },
  {
    key: "bh",
    out: ["B·h", "β_h"],
    desc: "Magnetic-height term or beta index.",
  },
  { key: "gh", out: ["g·h", "ΔU"], desc: "Gravitational potential step." },
  {
    key: "ng",
    out: ["η_g", "n·g"],
    desc: "Efficiency index or density-gravity.",
  },
  {
    key: "st",
    out: ["s·t", "∫dt"],
    desc: "Distance-time pair or time integral.",
  },
  {
    key: "pr",
    out: ["P_r", "p·r"],
    desc: "Pressure-radius or Prandtl style index.",
  },
  { key: "ra", out: ["r_a", "R_a"], desc: "Radius-at-a or resistance index." },
  {
    key: "ma",
    out: ["m·a", "F"],
    desc: "Force core: mass times acceleration.",
  },
  { key: "ka", out: ["k_a", "κ_a"], desc: "Spring/curvature constant at a." },
  { key: "ya", out: ["y_a", "γ_a"], desc: "Y-position or gamma index." },
  {
    key: "na",
    out: ["N_A", "n_a"],
    desc: "Avogadro constant or amount index.",
  },
  { key: "la", out: ["λ", "L_a"], desc: "Wavelength or length index." },
  { key: "ri", out: ["r_i", "R_i"], desc: "Inner radius or resistance index." },
  {
    key: "vi",
    out: ["v_i", "V_i"],
    desc: "Initial velocity or initial voltage.",
  },
  {
    key: "li",
    out: ["ℓ_i", "L_i"],
    desc: "Length element or inductance index.",
  },
  { key: "an", out: ["a_n", "∠n"], desc: "Nth acceleration or angle marker." },
  { key: "ar", out: ["a_r", "r"], desc: "Radial acceleration or radius." },
  { key: "sa", out: ["s_a", "σ_a"], desc: "Path coordinate or sigma index." },
  { key: "ha", out: ["h_a", "ℏ"], desc: "Height index or reduced Planck." },
  { key: "ta", out: ["τ_a", "t_a"], desc: "Time constant or time index." },

  { key: "force", out: ["F", "m·a"], desc: "Force or mass-acceleration form." },
  {
    key: "energy",
    out: ["E", "m c^2"],
    desc: "Energy core or relativistic form.",
  },
  {
    key: "power",
    out: ["P", "F·v"],
    desc: "Power or force-velocity transfer.",
  },
  { key: "work", out: ["W", "∫F·ds"], desc: "Work or force along path." },
  { key: "heat", out: ["Q", "m c_p ΔT"], desc: "Heat or calorimetry form." },
  { key: "mass", out: ["m", "ρV"], desc: "Mass or density-volume form." },
  {
    key: "wave",
    out: ["λ", "f^{-1}c"],
    desc: "Wavelength or c over frequency.",
  },

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
  {
    key: "gamma",
    out: ["γ"],
    desc: "Gamma: energy scale or relativity factor.",
  },
  { key: "delta", out: ["Δ"], desc: "Delta: change or difference." },
  { key: "theta", out: ["θ"], desc: "Theta: angle or phase." },
  { key: "lambda", out: ["λ"], desc: "Lambda: wavelength or eigen-parameter." },
  { key: "sigma", out: ["σ", "∑"], desc: "Sigma: stress or summation." },
  { key: "phi", out: ["φ", "Φ"], desc: "Phi: phase or flux." },
  {
    key: "omega",
    out: ["Ω", "ω"],
    desc: "Omega: resistance or angular frequency.",
  },
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
  "ab",
  "ad",
  "ag",
  "ak",
  "al",
  "am",
  "an",
  "ar",
  "as",
  "at",
  "av",
  "ay",
  "ba",
  "be",
  "bi",
  "bo",
  "bu",
  "by",
  "ca",
  "ce",
  "ci",
  "co",
  "cu",
  "cy",
  "da",
  "de",
  "di",
  "do",
  "du",
  "ea",
  "el",
  "em",
  "en",
  "er",
  "es",
  "et",
  "fa",
  "fi",
  "fo",
  "ga",
  "ge",
  "gi",
  "go",
  "ia",
  "il",
  "im",
  "in",
  "ir",
  "is",
  "it",
  "ja",
  "je",
  "ji",
  "jo",
  "ki",
  "ko",
  "ku",
  "le",
  "lo",
  "lu",
  "me",
  "mi",
  "mo",
  "mu",
  "ne",
  "ni",
  "no",
  "nu",
  "ol",
  "om",
  "on",
  "or",
  "os",
  "ot",
  "pa",
  "pe",
  "pi",
  "po",
  "pu",
  "re",
  "ro",
  "ru",
  "se",
  "si",
  "so",
  "su",
  "te",
  "ti",
  "to",
  "tu",
  "ul",
  "um",
  "un",
  "ur",
  "va",
  "ve",
  "vo",
  "wa",
  "wi",
  "ya",
  "yo",
  "za",
  "ze",
  "zi",
  "zo",
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
      out = [
        "[" + "r_" + syl[1] + "]".replace("[", "").replace("]", ""),
        "R_" + syl[1],
      ];
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
    fontSize: 64, // will be calculated once
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

    stateRef.current = {
      lineIndex: 0,
      charIndex: 0,
      done: false,
      fontSize: 64,
    };

    const chalkColor = "rgba(245,245,245,0.92)";
    const fullText = textLines[0] || "";

    // ----------- CALCULATE FONT SIZE ONCE (using FULL string) -----------

    const horizontalPadding = 180;
    const maxWidth = rect.width - horizontalPadding;
    const maxHeight = rect.height - 160;

    let fontSize = 64;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    while (fontSize > 24) {
      ctx.font = `${fontSize}px 'Patrick Hand', 'Comic Sans MS', system-ui`;
      const width = ctx.measureText(fullText).width;

      if (width <= maxWidth && fontSize <= maxHeight * 0.5) break;

      fontSize -= 2;
    }

    stateRef.current.fontSize = fontSize;

    // ---------------------------------------------------------------

    function clear() {
      ctx.clearRect(0, 0, rect.width, rect.height);
    }

    function drawChalkText(partialText) {
      clear();

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowColor = "rgba(255,255,255,0.25)";
      ctx.shadowBlur = 2;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${stateRef.current.fontSize}px 'Patrick Hand', 'Comic Sans MS', system-ui`;
      ctx.fillStyle = chalkColor;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      ctx.fillText(partialText, centerX, centerY);

      // subtle underline
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(
        rect.width * 0.2,
        centerY + stateRef.current.fontSize * 0.6,
        rect.width * 0.6,
        1,
      );

      ctx.restore();
    }

    function step() {
      const st = stateRef.current;
      if (st.done) return;

      const full = textLines[0] || "";
      const partial = full.slice(0, Math.floor(st.charIndex));

      drawChalkText(partial);

      const speed = 0.6;
      st.charIndex += speed;

      if (st.charIndex >= full.length) {
        st.done = true;
        drawChalkText(full);
        onDone?.();
        return;
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

  const patterns = FULL_BANK.slice().sort(
    (a, b) => b.key.length - a.key.length,
  );

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
    interpretations.push({
      chunk: matched.key,
      out: chosen,
      desc: matched.desc,
    });

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

  const pretty =
    formula.length > 18 ? ` ${formula}` : formula;
  return { cleaned, formula: pretty, interpretations };
}








function ChalkFormula({ text, onComplete, onDustCreated }) {
  const [visibleChars, setVisibleChars] = useState(0);
  const [dust, setDust] = useState([]);
  const [chalkPos, setChalkPos] = useState({ x: 0, y: 0 });
  const [isScribbling, setIsScribbling] = useState(false);

  const dustIdCounter = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let current = 0;
    let mounted = true;
    let dustInterval;
    let nextCharTimeout;
    let completionTimeout;

    setVisibleChars(0);
    setDust([]);
    setIsScribbling(false);
    setChalkPos({ x: 0, y: 0 });

    const writeNextChar = async () => {
      if (!mounted) return;

      if (current >= text.length) {
        completionTimeout = setTimeout(() => {
          if (mounted) onComplete?.();
        }, 500);
        return;
      }

      const char = text[current];

      if (char === " ") {
        current += 1;
        setVisibleChars(current);
        setChalkPos({ x: 0, y: 0 });
        nextCharTimeout = setTimeout(writeNextChar, 50);
        return;
      }

      setIsScribbling(true);
      setVisibleChars(current + 1);

      const traceDuration = 180 + Math.random() * 180;
      const startTime = performance.now();

      dustInterval = setInterval(() => {
        const id = dustIdCounter.current++;
        const isLarge = Math.random() > 0.88;
        const dustX = Math.random() * 20 - 10;

        setDust((prev) => [
          ...prev,
          {
            id,
            x: dustX,
            y: Math.random() * 10 - 5,
            size: isLarge ? 4 : 2,
            duration: isLarge ? 1800 : 1200,
          },
        ]);

        onDustCreated?.(((current + 0.5) / Math.max(text.length, 1)) * 100);

        setTimeout(() => {
          setDust((prev) => prev.filter((d) => d.id !== id));
        }, isLarge ? 1800 : 1200);
      }, 22);

      const animateChalk = () => {
        if (!mounted) return;

        const elapsed = performance.now() - startTime;
        if (elapsed < traceDuration) {
          const progress = elapsed / traceDuration;
          const angle = progress * Math.PI * 6;

          setChalkPos({
            x: Math.sin(angle) * 12 + (Math.random() * 3 - 1.5),
            y: Math.cos(angle * 1.15) * 16 + (Math.random() * 3 - 1.5),
          });

          rafRef.current = requestAnimationFrame(animateChalk);
        }
      };

      animateChalk();

      await new Promise((resolve) => setTimeout(resolve, traceDuration));

      if (!mounted) return;

      clearInterval(dustInterval);
      setIsScribbling(false);
      current += 1;

      nextCharTimeout = setTimeout(writeNextChar, 30 + Math.random() * 70);
    };

    writeNextChar();

    return () => {
      mounted = false;
      clearInterval(dustInterval);
      clearTimeout(nextCharTimeout);
      clearTimeout(completionTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, onComplete, onDustCreated]);

  return (
    <div className="relative flex w-full flex-wrap items-center justify-center gap-y-2 py-4">
      {text.split("").map((char, idx) => (
        <div
          key={`${char}-${idx}`}
          className="relative inline-flex h-[64px] w-[26px] items-center justify-center md:h-[88px] md:w-[34px] lg:h-[100px] lg:w-[40px]"
        >
          <motion.span
            initial={{
              opacity: 0,
              filter: "blur(4px) brightness(2)",
              clipPath: "inset(0 100% 0 0)",
            }}
            animate={{
              opacity: idx < visibleChars ? 1 : 0,
              filter:
                idx < visibleChars
                  ? "blur(0px) brightness(1)"
                  : "blur(4px) brightness(2)",
              clipPath:
                idx < visibleChars
                  ? "inset(0 0% 0 0)"
                  : "inset(0 100% 0 0)",
            }}
            transition={{
              duration: 0.35,
              ease: "linear",
              opacity: { duration: 0.08 },
            }}
            style={{ filter: "url(#chalk-stroke)" }}
            className="font-chalk chalk-text whitespace-pre inline-block text-3xl text-white/90 drop-shadow-[0_0_1px_rgba(255,255,255,0.25)] md:text-5xl lg:text-6xl"
          >
            {char}
          </motion.span>

          {idx === visibleChars - 1 && isScribbling && (
            <motion.div
              animate={{
                opacity: [0.18, 0.42, 0.18],
                scale: [0.75, 1.25, 0.75],
                rotate: [0, 50, 90, 130],
              }}
              transition={{ repeat: Infinity, duration: 0.12 }}
              className="pointer-events-none absolute inset-0 z-10 rounded-full bg-white/20 blur-2xl"
            />
          )}

          {idx === visibleChars - 1 && isScribbling && (
            <motion.div
              className="absolute z-30 h-12 w-4 rounded-sm bg-white/95 shadow-[0_0_28px_rgba(255,255,255,0.65)] md:h-14 md:w-5"
              style={{
                left: `calc(50% + ${chalkPos.x}px)`,
                top: `calc(50% + ${chalkPos.y}px)`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                rotate: [22, 42, 18, 32],
                scaleY: [1, 0.85, 1.12, 1],
                x: [0, 2, -2, 0],
                y: [0, -2, 2, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.07,
                ease: "linear",
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent opacity-100 blur-[2px]" />
            </motion.div>
          )}

          {idx === visibleChars - 1 && isScribbling && (
            <AnimatePresence>
              {dust.map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 1, y: 10, x: `calc(50% + ${d.x}px)` }}
                  animate={{
                    opacity: 0,
                    y: 170,
                    x: `calc(50% + ${d.x + (Math.random() * 70 - 35)}px)`,
                    rotate: Math.random() * 720,
                  }}
                  exit={{ opacity: 0 }}
                  style={{ width: d.size, height: d.size }}
                  className="pointer-events-none absolute rounded-full bg-white/90 shadow-[0_0_4px_rgba(255,255,255,0.4)]"
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ResultScreen({ name, onBack }) {
  const compiled = useMemo(() => compileNameToFormula(name), [name]);
  const [done, setDone] = useState(false);
  const [accumulatedDust, setAccumulatedDust] = useState([]);

  useEffect(() => {
    setDone(false);
    setAccumulatedDust([]);
  }, [name]);

  const addDust = useCallback((xPercent) => {
    setAccumulatedDust((prev) =>
      [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          x: xPercent,
          opacity: Math.random() * 0.45 + 0.12,
          scale: 0.6 + Math.random() * 0.9,
        },
      ].slice(-120),
    );
  }, []);

  const handleChalkComplete = useCallback(() => {
  setDone(true);
}, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-900 px-4 py-4 text-zinc-100">
      <svg className="hidden">
        <filter id="chalk-texture">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.95"
            numOctaves="6"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
        </filter>

        <filter id="chalk-stroke">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.5"
            numOctaves="4"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" />
          <feGaussianBlur stdDeviation="0.18" />
        </filter>
      </svg>

      <div className="w-full max-w-6xl">
        <div className="relative mx-auto aspect-square w-[min(88vmin,760px)]">
          <div className="absolute -inset-5 rounded-[26px] border-[18px] border-[#3b2414] bg-[#1a100a] shadow-[0_40px_120px_rgba(0,0,0,0.75)]" />

          <div
            className="chalkboard-texture relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-[16px] border-[6px] border-[#5b3a1e] px-5 py-5 shadow-[inset_0_0_180px_rgba(0,0,0,0.55)] md:px-10 md:py-10"
            style={{ filter: "url(#chalk-texture)" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_35%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.03),transparent_40%)]" />

            <div className="relative z-10 flex h-full w-full items-center justify-center">
              <ChalkFormula
                text={compiled.formula}
              onComplete={handleChalkComplete}
                onDustCreated={addDust}
              />
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
              {accumulatedDust.map((d) => (
                <div
                  key={d.id}
                  className="absolute bottom-0 h-12 w-16 rounded-full bg-white/20 blur-[22px]"
                  style={{
                    left: `calc(${d.x}% - 32px)`,
                    opacity: d.opacity,
                    transform: `scale(${d.scale})`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 z-20 flex h-8 w-48 -translate-x-1/2 items-center justify-center gap-4 rounded-b-[2rem] border-t border-white/10 bg-[#2d1b10] shadow-2xl">
            <div className="h-3 w-10 rotate-[22deg] rounded-sm bg-white/95" />
            <div className="h-3 w-8 rotate-[-18deg] rounded-sm bg-white/80" />
            <div className="h-4 w-12 rounded-sm border border-zinc-700 bg-zinc-900" />
          </div>

          <span className="sr-only">
            {done ? "Chalk complete." : "Writing..."}
          </span>
        </div>
      </div>
    </div>
  );
}