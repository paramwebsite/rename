
export const THEME = {
  background: '#f4e4bc',
  land: '#d9c5a0',
  // border: '#5d4037',
  border: '#000',
  highlight: '#8a3b2e', // Primary (Top 3)
  highlightSecondary: '#b07b6d', // Secondary (Others)
  highlightOrigin: '#2e338a', // Origin Blue
  text: '#5d4037',
  legendBg: '#5d4037',
  legendText: '#f4e4bc',
};

// High-quality world atlas URL
export const TOPO_JSON_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
export const INDIA_TOPO_JSON_URL = "/maps/india.topo.json";


/**
 * Coordinate overrides for nations too small for the 110m topojson.
 * Format: [Longitude, Latitude]
 */
export const COORDINATES_OVERRIDE: Record<string, [number, number]> = {
  "mauritius": [57.5522, -20.3484],
  "singapore": [103.8198, 1.3521],
  "maldives": [73.5361, 1.9772],
  "seychelles": [55.4920, -4.6796],
  "barbados": [-59.5432, 13.1939],
  "malta": [14.3754, 35.9375],
  "bahrain": [50.5860, 26.0667],
  "fiji": [178.0650, -17.7134],
};

/**
 * Normalizes country names for matching.
 */
export const normalizeCountry = (name: string): string => {
  if (!name) return "";
  
  const norm = name.toLowerCase()
    .trim()
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ");

  const aliases: Record<string, string> = {
    "us": "united states of america",
    "usa": "united states of america",
    "united states": "united states of america",
    "uk": "united kingdom",
    "gb": "united kingdom",
    "great britain": "united kingdom",
    "uae": "united arab emirates",
    "emirates": "united arab emirates",
    "russia": "russian federation",
    "vietnam": "viet nam",
    "bahamas": "the bahamas",
    "south korea": "korea",
    "north korea": "dem rep korea",
    "congo": "dem rep congo",
    "tanzania": "united rep of tanzania",
    "ivory coast": "côte d'ivoire",
  };

  return aliases[norm] || norm;
};

export const normalizeName = (name: string) => name.toLowerCase().trim();
