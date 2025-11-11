// routes/nameCount.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const DATA_FILE = path.join(process.cwd(), "data", "names.json");

// ensure data folder & file exist
if (!fs.existsSync(path.dirname(DATA_FILE))) fs.mkdirSync(path.dirname(DATA_FILE));
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

router.post("/add", async (req, res) => {
  const { name, surname } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const data = JSON.parse(raw);

    const now = new Date().toISOString();
    const newEntry = { name: name.trim(), surname: surname?.trim() || "", datetime: now };

    // push entry
    data.push(newEntry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    // count name and surname occurrences
    const nameCount = data.filter(e => e.name.toLowerCase() === name.toLowerCase()).length;
    const surnameCount = surname
      ? data.filter(e => e.surname.toLowerCase() === surname.toLowerCase()).length
      : 0;

    const nameMsg = `You are the ${nameCount}${getOrdinal(nameCount)} ${name} in this organisation.`;
    const surnameMsg = surname
      ? `You are the ${surnameCount}${getOrdinal(surnameCount)} ${surname} in this organisation.`
      : "";

    res.json({ message: `${nameMsg} ${surnameMsg}`.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving entry" });
  }
});

// helper for ordinal numbers
function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default router;
