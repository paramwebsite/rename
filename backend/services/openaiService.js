const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getNameIntelligence(name) {
  const prompt = `
You are a global name research assistant.

For the name "${name}", return:

1) Common spelling variants worldwide.
2) One real famous person with this exact name.

Return ONLY valid JSON in this format:

{
  "variants": ["", "", ""],
  "famousCandidate": {
    "name": "",
    "profession": "",
    "country": "",
    "whyFamous": "",
    "mostFamousWork": ""
  }
}

Rules:
- Famous person must be real.
- whyFamous must be strictly between 100 to 120 characters.
- No explanation text outside JSON.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;

  return JSON.parse(content);
}

module.exports = { getNameIntelligence };
