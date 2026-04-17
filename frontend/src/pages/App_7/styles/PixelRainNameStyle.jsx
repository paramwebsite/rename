import { useEffect, useRef } from "react";

export default function PixelRainNameStyle({ name }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    let animationFrameId;

    const WORD = (name || "").toUpperCase();

    // =========================
    // MAIN SETTINGS
    // =========================
    let FONT_SIZE = 28; // You can experiment here, but resize() also recalculates it dynamically
    const speedMult = 1.0;
    const glowMult = 1.5;
    const LETTER_GAP = 20;

    const CHARS =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&ಅಆಇಈಉಊಋಎಏಐಒಓಔ|ಕಖಗಘಙಚಛಜಝಞಟಠಡಢಣತಥದಧನಪಫಬಭಮಯರಲವಶಷಸಹಳಕ್ಷಜ್ಞ.";

    let cols = 0;
    let drops = [];
    let speeds = [];
    let trails = [];

    // Separate background rain so the area below/behind the frozen word never feels empty
    let bgDrops = [];
    let bgSpeeds = [];
    let bgTrails = [];

    let phase = "rain";
    let phaseTimer = 0;
    const RAIN_DUR = 100;
    const FROZEN_DUR = 100;

    let wordCols = {};
    let frozenCols = {};
    let globalFrame = 0;
    let activateAt = {};
    let dissolveAt = {};

    const cellChars = {};
    const bgCellChars = {};

    const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    const randCharForCell = (map, col, row) => {
      const key = `${col},${row}`;
      if (!map[key] || Math.random() < 0.04) map[key] = randChar();
      return map[key];
    };

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const lerp = (a, b, t) => a + (b - a) * t;

    const hexToRgb = (hex) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    });

    const rgbaFromRgb = (r, g, b, a) =>
      `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${a})`;

    // Smooth rainbow color shared by ALL raining letters at the same time
    // If you want faster/slower color change, edit the speed inside getGlobalRainColor()
    const getGlobalRainColor = () => {
      const t = globalFrame * 0.012; // <-- Change this for faster/slower rainbow transition
      const r = 127 + 127 * Math.sin(t);
      const g = 127 + 127 * Math.sin(t + (2 * Math.PI) / 3);
      const b = 127 + 127 * Math.sin(t + (4 * Math.PI) / 3);
      return { r, g, b };
    };

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // =========================
      // FONT SIZE CONTROL
      // =========================
      // This is the main place to experiment with text size.
      // Smaller FONT_SIZE = more columns
      // Larger FONT_SIZE = fewer columns
      FONT_SIZE = Math.min(
        Math.floor(canvas.width / Math.max(WORD.length, 10)),
        48,
      );

      if (FONT_SIZE < 14) FONT_SIZE = 14; // minimum limit

      init();
    };

    const init = () => {
      // =========================
      // COLUMN COUNT
      // =========================
      // This decides how many columns fit on screen.
      // If you want MORE columns than normal, try:
      // cols = Math.floor(canvas.width / (FONT_SIZE * 0.9));
      // If you want FEWER columns, try:
      // cols = Math.floor(canvas.width / (FONT_SIZE * 1.1));
      cols = Math.floor(canvas.width / FONT_SIZE);

      const rows = Math.ceil(canvas.height / FONT_SIZE);

      drops = [];
      speeds = [];
      trails = [];
      bgDrops = [];
      bgSpeeds = [];
      bgTrails = [];

      frozenCols = {};
      wordCols = {};
      activateAt = {};
      dissolveAt = {};
      phase = "rain";
      phaseTimer = 0;
      globalFrame = 0;

      for (let i = 0; i < cols; i++) {
        drops[i] = -(Math.random() * rows * 0.8);
        speeds[i] = 0.3 + Math.random() * 0.7;
        trails[i] = 8 + Math.floor(Math.random() * 16);

        bgDrops[i] = -(Math.random() * rows);
        bgSpeeds[i] = 0.35 + Math.random() * 0.9;
        bgTrails[i] = 10 + Math.floor(Math.random() * 18);
      }

      layoutWord();
    };

    const layoutWord = () => {
      const wordLen = WORD.length;
      const startCol = Math.floor((cols - wordLen) / 2);
      const targetRow = Math.floor((canvas.height / FONT_SIZE) * 0.48);

      wordCols = {};
      for (let i = 0; i < wordLen; i++) {
        const col = startCol + i;
        if (col >= 0 && col < cols) {
          wordCols[col] = { char: WORD[i], targetRow, charIdx: i };
        }
      }
    };

    const activateLetter = (idx) => {
      for (const col in wordCols) {
        const wc = wordCols[col];
        if (wc.charIdx === idx && !frozenCols[col]) {
          frozenCols[col] = { ...wc, progress: 0, frozenRow: null };
          drops[col] = -(2 + Math.random() * 8);
        }
      }
    };

    const startFreezing = () => {
      frozenCols = {};
      activateAt = {};
      for (let i = 0; i < WORD.length; i++) {
        activateAt[i] = globalFrame + Math.round(i * LETTER_GAP);
      }
    };

    const startMelting = () => {
      dissolveAt = {};
      for (let i = 0; i < WORD.length; i++) {
        const charIdx = WORD.length - 1 - i;
        dissolveAt[charIdx] = globalFrame + Math.round(i * LETTER_GAP);
      }
    };

    const dissolveLetter = (idx) => {
      for (const col in frozenCols) {
        if (frozenCols[col].charIdx === idx) {
          frozenCols[col].dissolving = true;
        }
      }
    };

    const tickPhase = () => {
      globalFrame++;
      phaseTimer++;

      if (phase === "rain" && phaseTimer > RAIN_DUR) {
        phase = "freezing";
        phaseTimer = 0;
        startFreezing();
      } else if (phase === "freezing") {
        for (let i = 0; i < WORD.length; i++) {
          if (activateAt[i] !== undefined && globalFrame >= activateAt[i]) {
            activateLetter(i);
            delete activateAt[i];
          }
        }

        const allSent = Object.keys(activateAt).length === 0;
        const allLocked =
          allSent &&
          Object.keys(frozenCols).length === WORD.length &&
          Object.values(frozenCols).every(
            (f) => f.frozenRow !== null && f.progress >= 1,
          );

        if (allLocked) {
          phase = "frozen";
          phaseTimer = 0;
        }
      } else if (phase === "frozen" && phaseTimer > FROZEN_DUR) {
        phase = "melting";
        phaseTimer = 0;
        startMelting();
      } else if (phase === "melting") {
        for (let i = 0; i < WORD.length; i++) {
          if (dissolveAt[i] !== undefined && globalFrame >= dissolveAt[i]) {
            dissolveLetter(i);
            delete dissolveAt[i];
          }
        }

        for (const col in { ...frozenCols }) {
          const fc = frozenCols[col];
          if (fc.dissolving) {
            fc.progress = Math.max(0, fc.progress - 0.032 * speedMult);
            if (fc.progress <= 0) {
              speeds[col] = 1.2 + Math.random() * 0.8;
              drops[col] = fc.frozenRow;
              delete frozenCols[col];
            }
          }
        }

        const allScheduled = Object.keys(dissolveAt).length === 0;
        const allGone = allScheduled && Object.keys(frozenCols).length === 0;
        if (allGone) {
          phase = "rain";
          phaseTimer = 0;
        }
      }
    };

    const drawBackgroundRain = (rows, fs, rainColor) => {
      for (let i = 0; i < cols; i++) {
        const x = i * fs;
        const drop = bgDrops[i];
        const tl = bgTrails[i];

        for (let t = 1; t <= tl; t++) {
          const row = Math.floor(drop) - t;
          if (row < 0 || row >= rows) continue;

          const fade = 1 - t / tl;

          // Make background rain more faded so frozen letters stand out more
          const alpha = fade * fade * 0.14; // <-- increase/decrease to adjust visibility
          ctx.fillStyle = rgbaFromRgb(
            rainColor.r,
            rainColor.g,
            rainColor.b,
            alpha,
          );
          ctx.fillText(randCharForCell(bgCellChars, i, row), x, row * fs + fs);
        }

        const headRow = Math.floor(drop);
        if (headRow >= 0 && headRow < rows) {
          ctx.shadowColor = rgbaFromRgb(
            rainColor.r,
            rainColor.g,
            rainColor.b,
            1,
          );
          ctx.shadowBlur = 7;
          ctx.fillStyle = rgbaFromRgb(
            rainColor.r,
            rainColor.g,
            rainColor.b,
            0.42,
          ); // <-- faded head
          ctx.fillText(randChar(), x, headRow * fs + fs);
          ctx.shadowBlur = 0;
        }

        bgDrops[i] += bgSpeeds[i] * 0.8;
        if (bgDrops[i] > rows + bgTrails[i]) {
          bgDrops[i] = -(1 + Math.random() * 8);
        }
      }
    };

    const drawMainRainAndWord = () => {
      const rows = Math.ceil(canvas.height / FONT_SIZE);
      const fs = FONT_SIZE;
      const rainColor = getGlobalRainColor();

      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `bold ${fs}px 'Courier New', monospace`;

      // Background rain continues everywhere, including below the frozen word
      drawBackgroundRain(rows, fs, rainColor);

      for (let i = 0; i < cols; i++) {
        const x = i * fs;
        const drop = drops[i];
        const info = frozenCols[i];
        const isFrozenCol = !!info;

        // Main rain trail
        const tl = trails[i];
        for (let t = 1; t <= tl; t++) {
          const row = Math.floor(drop) - t;
          if (row < 0 || row >= rows) continue;
          if (isFrozenCol && info.frozenRow !== null && row === info.frozenRow)
            continue;

          const fade = 1 - t / tl;

          // Make normal rain more faded so the frozen name stands out
          const alpha = fade * fade * 0.22; // <-- increase for brighter rain, decrease for more subtle rain
          ctx.fillStyle = rgbaFromRgb(
            rainColor.r,
            rainColor.g,
            rainColor.b,
            alpha,
          );
          ctx.fillText(randCharForCell(cellChars, i, row), x, row * fs + fs);
        }

        // Rain head
        if (!isFrozenCol || info.frozenRow === null) {
          const headRow = Math.floor(drop);
          if (headRow >= 0 && headRow < rows) {
            ctx.shadowColor = rgbaFromRgb(
              rainColor.r,
              rainColor.g,
              rainColor.b,
              1,
            );
            ctx.shadowBlur = 9 * glowMult;

            // Also keep head somewhat faded so frozen word dominates
            ctx.fillStyle = rgbaFromRgb(
              rainColor.r,
              rainColor.g,
              rainColor.b,
              0.6,
            );

            let headChar = randChar();
            if (isFrozenCol) headChar = info.char;

            ctx.fillText(headChar, x, headRow * fs + fs);
            ctx.shadowBlur = 0;
          }
        }

        // Frozen letter
        if (isFrozenCol && info.frozenRow !== null) {
          const fr = info.frozenRow;
          const y = fr * fs + fs;
          const prog = clamp(info.progress, 0, 1);

          // Whitish highlight for frozen letters
          // Brighter than rain, with a stronger glow and a subtle backing glow rectangle
          const white = 245 + 10 * Math.sin(globalFrame * 0.05);

          // Soft glow behind the frozen letter for readability
          // ctx.fillStyle = `rgba(255,255,255,${0.06 + prog * 0.08})`;
          // ctx.fillRect(x - fs * 0.08, fr * fs + fs * 0.08, fs * 1.08, fs * 0.9);

          ctx.shadowColor = `rgba(255,255,255,${0.95})`;
          ctx.shadowBlur = 18 + prog * 18 * glowMult;
          ctx.fillStyle = `rgb(${white | 0}, ${white | 0}, 255)`;
          ctx.fillText(info.char, x, y);
          ctx.shadowBlur = 0;

          // Extra shimmer/highlight
          // if (prog > 0.35 && !info.dissolving && Math.random() > 0.7) {
          //   ctx.fillStyle = `rgba(255,255,255,${0.08 + prog * 0.18})`;
          //   ctx.fillRect(x, (fr - 1) * fs + fs * 0.6, fs, fs * 0.25);
          //   ctx.fillRect(x, (fr + 1) * fs, fs, fs * 0.25);
          // }
        }

        // Movement logic
        if (isFrozenCol && info.frozenRow === null) {
          const dist = Math.abs(info.targetRow - Math.floor(drops[i]));
          const slow = dist < 6 ? Math.max(0.04, dist / 6) : 1;
          drops[i] += speeds[i] * speedMult * slow;

          if (Math.floor(drops[i]) >= info.targetRow) {
            info.frozenRow = info.targetRow;
            drops[i] = info.targetRow;
          }
        } else if (!isFrozenCol) {
          drops[i] += speeds[i] * speedMult;
          if (drops[i] > rows + trails[i]) {
            drops[i] = -(1 + Math.random() * 8);
          }
        }

        // if (isFrozenCol && info.frozenRow !== null) {
        //   info.progress += 0.022 * speedMult;
        // }

        if (isFrozenCol && info.frozenRow !== null && !info.dissolving) {
          info.progress = Math.min(1, info.progress + 0.022 * speedMult);
        }
      }
    };

    const animate = () => {
      tickPhase();
      drawMainRainAndWord();
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [name]);

  return <canvas ref={canvasRef} className="w-full h-full block bg-zinc-950" />;
}
