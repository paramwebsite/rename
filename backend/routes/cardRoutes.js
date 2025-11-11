// import express from "express";
// import Card from "../models/card.js";

// const router = express.Router();

// // GET /card/authenticate
// router.get("/authenticate", async (req, res) => {
//   try {
//     const card = await Card.findOne({ isCardActive: true });
//     if (!card) return res.status(404).json({ message: "No active card found" });

//     res.json({ UID: card.UID });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

// routes/cardRoutes.js
import express from "express";
import Card from "../models/card.js";

const router = express.Router();

function normalizeUID(uid = "") {
  return String(uid).replace(/\s+/g, "").toUpperCase();
}

/**
 * GET /card/authenticate?UID=03 4F 68 36
 * Response:
 *  - 200 { message: "Auth OK", card: {...} }                    if isCardActive === true
 *  - 403 { message: "Card not authorized", card: {...} }        if found but inactive
 *  - 404 { message: "Card not found", card: null }              if not found
 */
router.get("/authenticate", async (req, res) => {
  try {
    const rawUID = (req.query.UID ?? "").toString().trim();
    if (!rawUID) return res.status(400).json({ message: "UID is required", card: null });

    // Prefer exact; also tolerate space/case differences
    let card =
      (await Card.findOne({ UID: rawUID })) ||
      (await Card.findOne({
        UID: new RegExp(`^${rawUID.replace(/\s+/g, "\\s*")}$`, "i"),
      }));

    if (!card) {
      return res.status(404).json({ message: "Card not found", card: null });
    }

    if (card.isCardActive === true) {
      return res.status(200).json({ message: "Auth OK", card });
    }

    return res.status(403).json({ message: "Card not authorized", card });
  } catch (err) {
    console.error("GET /card/authenticate error:", err);
    return res.status(500).json({ message: "Server error", card: null });
  }
});

export default router;
