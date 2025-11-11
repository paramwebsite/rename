// import express from "express";
// import Event from "../models/event.js";

// const router = express.Router();

// // POST /events/add_event
// router.post("/add_event", async (req, res) => {
//   try {
//     const { UID, stationId, eventType } = req.body;

//     if (!UID || !stationId || !eventType) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const event = new Event({ UID, stationId, eventType });
//     await event.save();

//     res.status(201).json({ message: "Event added", event });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;
import express from "express";
import Event from "../models/event.js";
import Card from "../models/card.js";

const router = express.Router();

async function authByUID(rawUID) {
  if (!rawUID) return { status: 400, body: { message: "UID is required", card: null } };

  let card =
    (await Card.findOne({ UID: rawUID })) ||
    (await Card.findOne({
      UID: new RegExp(`^${rawUID.replace(/\s+/g, "\\s*")}$`, "i"),
    }));

  if (!card) return { status: 404, body: { message: "Card not found", card: null } };
  if (card.isCardActive === true) return { status: 200, body: { message: "Auth OK", card } };
  return { status: 403, body: { message: "Card not authorized", card } };
}

/**
 * POST /events/add_event
 * Body: { UID, stationId, eventType }
 *
 * Behavior:
 *  - First authenticate with same logic as GET /card/authenticate.
 *  - If NOT authorized: return that same response (status + body). DO NOT insert/emit.
 *  - If authorized: insert event and emit sockets.
 */
router.post("/add_event", async (req, res) => {
  try {
    const { UID, stationId, eventType } = req.body || {};
    if (!UID || !stationId || !eventType) {
      return res.status(400).json({ message: "UID, stationId, eventType required" });
    }

    // ✅ Gate: reuse the same auth contract as GET /card/authenticate
    const auth = await authByUID(UID);
    if (auth.status !== 200) {
      // Do NOT touch Event collection; just return the same auth payload
      return res.status(auth.status).json(auth.body);
    }

    // ✅ Authorized — proceed with event insert and immediate emit
    const doc = await Event.create({
      UID,
      stationId,
      eventType,
      timestamp: new Date(),
    });

    if (eventType === "cardDetected") {
      req.io?.emit("card-detected", { UID, stationId });
    } else if (eventType === "cardLifted") {
      req.io?.emit("card-lifted", { UID, stationId });
    }

    return res.json({ ok: true, event: doc });
  } catch (err) {
    console.error("POST /events/add_event error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
