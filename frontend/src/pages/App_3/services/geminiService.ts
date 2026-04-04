// import OpenAI from "openai";
// import { PopularityResponse } from "../types";

// /**
//  * Fetches name popularity and origin data using OpenAI API.
//  */
// const client = new OpenAI({
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY, // use process.env.OPENAI_API_KEY on backend
//   dangerouslyAllowBrowser: true, // remove if backend
// });

// export const fetchNamePopularity = async (
//   name: string
// ): Promise<PopularityResponse> => {
//   if (!name.trim()) return { countries: [] };

//   try {
//     const response = await client.responses.create({
//       model: "o4-mini",
//       reasoning: { effort: "high" },
//       input: [
//         {
//           role: "system",
//           content:
//             "You are a professional cartographic researcher. Provide historical and statistical name data in strict JSON format.",
//         },
//         {
//           role: "user",
//           content: `
// Return ONLY valid JSON. No explanations. No markdown.

// JSON FORMAT:
// {
//   "countries": [
//     {
//       "country_name": string,
//       "country_code": string,
//       "ratio": string,
//       "estimated_population": string
//     }
//   ],
//   "origin": {
//     "country_name": string,
//     "country_code": string,
//     "meaning": string,
//     "ratio": string
//   } | null
// }

// TASK:
// Analyze global popularity for "${name}".
// Provide top 5 countries (minimum 3 if data exists), origin country, and meaning.
// Format ratios as 1:X.
// If no reliable data exists, return:
// {
//   "countries": [],
//   "origin": null
// }
// `,
//         },
//       ],
//     });

//     const text = response.output_text?.trim();
//     if (!text) return { countries: [] };

//     const parsed = JSON.parse(text) as PopularityResponse;

//     return {
//       countries: Array.isArray(parsed.countries) ? parsed.countries : [],
//       origin: parsed.origin ?? null,
//     };
//   } catch (err) {
//     console.error("Failed to fetch from OpenAI API", err);
//     throw err;
//   }
// };


import OpenAI from "openai";
import { PopularityResponse } from "../types";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const fetchNamePopularity = async (
  name: string
): Promise<PopularityResponse> => {
  if (!name.trim()) return { countries: [] };

  try {
    const response = await client.responses.create({
      model: "o4-mini",
      reasoning: { effort: "high" },
      input: [
        {
          role: "system",
          content:
            "You are a professional cartographic researcher. Provide historical and statistical name data in strict JSON format.",
        },
        {
          role: "user",
          content: `
Return ONLY valid JSON. No explanations. No markdown.
JSON FORMAT:
{
  "countries": [
    {
      "country_name": string,
      "country_code": string,
      "ratio": string,
      "estimated_population": string
    }
  ],
  "origin": {
    "country_name": string,
    "country_code": string,
    "meaning": string (max 5 words, if unknown return "unknown"),
    "ratio": string
  } | null
}
TASK:
Analyze global popularity for "${name}".
Provide top 5 countries (minimum 3 if data exists), origin country, and meaning.
Format ratios as 1:X.
If no data exists for a field, set it to null or an empty array as appropriate.
If no reliable data exists, return:
{
  "countries": [],
  "origin": null
}
`,
        },
      ],
    });

    const text = response.output_text?.trim();
    if (!text) return { countries: [] };

    const parsed = JSON.parse(text) as PopularityResponse;
    return {
      countries: Array.isArray(parsed.countries) ? parsed.countries : [],
      origin: parsed.origin ?? null,
    };
  } catch (err) {
    console.error("Failed to fetch from OpenAI API", err);
    throw err;
  }
};