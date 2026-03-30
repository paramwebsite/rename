// spellerUtils.js
import { periodicElements } from "../data/periodicElements";

export const specialElements = {
  j: {
    symbol: "J",
    atomicNumber: "-",
    fullName: "Joule",
    type: "nonmetal",
    color: { from: "from-emerald-600/80", to: "to-emerald-400/80" },
  },
  e: {
    symbol: "e⁻",
    atomicNumber: "-",
    fullName: "Electron",
    type: "nonmetal",
    color: { from: "from-emerald-600/80", to: "to-emerald-400/80" },
  },
  r: {
    symbol: "R",
    atomicNumber: "-",
    fullName: "Roentgen",
    type: "nonmetal",
    color: { from: "from-emerald-600/80", to: "to-emerald-400/80" },
  },
  m: {
    symbol: "M",
    atomicNumber: "-",
    fullName: "Mole",
    type: "nonmetal",
    color: { from: "from-emerald-600/80", to: "to-emerald-400/80" },
  },
};

export function processText(text) {
  const results = [];
  let remaining = (text || "").toLowerCase().replace(/[^a-z]/g, "");

  while (remaining.length > 0) {
    let matched = false;

    // Try 2-letter match
    if (remaining.length >= 2) {
      const two = remaining.slice(0, 2);
      const el2 = periodicElements.find(
        (e) => e.symbol.toLowerCase() === two
      );
      if (el2) {
        results.push({
          symbol: el2.symbol,
          atomicNumber: el2.atomicNumber,
          fullName: el2.name,
          type: el2.type,
          color: el2.color,
        });
        remaining = remaining.slice(2);
        matched = true;
        continue;
      }
    }

    // Try special
    const one = remaining[0];
    if (specialElements[one]) {
      results.push(specialElements[one]);
      matched = true;
    } else {
      const el1 = periodicElements.find(
        (e) => e.symbol.toLowerCase() === one
      );
      if (el1) {
        results.push({
          symbol: el1.symbol,
          atomicNumber: el1.atomicNumber,
          fullName: el1.name,
          type: el1.type,
          color: el1.color,
        });
        matched = true;
      }
    }

    if (!matched) {
      results.push({
        symbol: one.toUpperCase(),
        atomicNumber: "-",
        fullName: one.toUpperCase(),
        type: "nonmetal",
        color: {
          from: "from-gray-600/80",
          to: "to-gray-400/80",
        },
      });
    }

    remaining = remaining.slice(1);
  }

  return results;
}
