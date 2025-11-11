// import express from "express";
// import Visitor from "../models/visitor.js";
// import multer from "multer";
// import fs from "fs";

// const router = express.Router();

// // Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });
// const upload = multer({ storage });

// // POST /visitors/data (file + name)
// router.post("/data", upload.single("snapshot"), async (req, res) => {
//   try {
//     const { UID, stationId, name , endReason} = req.body;

//     if (!UID || !stationId || !name || !req.file)
//       return res.status(400).json({ error: "Missing required fields" });

//     const img_address = `/uploads/${req.file.filename}`;

//     await Visitor.updateOne(
//       { UID },
//       { $set: { [`appData.${stationId}`]: { name, img_address } }, $setOnInsert: { isInside: true } },
//       { upsert: true }
//     );

//     res.json({ message: "Visitor data saved", img_address });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;
import express from "express";
import Visitor from "../models/visitor.js";
import multer from "multer";
import fs from "fs";

const router = express.Router();

// ---------- Multer storage ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

/**
 * POST /visitors/data
 * Can be called twice with the SAME route:
 * 1) First call: NO file (snapshot) -> sets name only
 *    Body (multipart/form-data or JSON): { UID, stationId, name }
 * 2) Second call: WITH file "snapshot" -> sets img_address (and optionally name again)
 *    Body (multipart/form-data): { UID, stationId, [name] }, file field: snapshot
 *
 * Behavior:
 * - UID and stationId are always required
 * - If no file is present, name is required (so we don't get an empty update)
 * - If file is present, name is optional (keeps previously stored name if missing)
 * - Sets appData.<stationId>.off = false on both calls (active session)
 * - Upserts the visitor document
 * - Emits "visitor-updated" with the latest stored data each time
 */
router.post("/data", upload.single("snapshot"), async (req, res) => {
  try {
    const { UID, stationId, name /*, endReason */ } = req.body || {};
    const hasFile = !!req.file;

    if (!UID || !stationId) {
      return res.status(400).json({ ok: false, error: "UID and stationId are required" });
    }

    // First call (no snapshot): we require a name to store
    if (!hasFile && !(typeof name === "string" && name.trim().length > 0)) {
      return res.status(400).json({
        ok: false,
        error: "Name is required when snapshot is not provided",
      });
    }

    // Build fields to update based on what we received
    const setFields = {
      UID,
      [`appData.${stationId}.off`]: false,
    };

    if (typeof name === "string" && name.trim().length > 0) {
      setFields[`appData.${stationId}.name`] = name.trim();
    }

    let img_address = null;
    if (hasFile) {
      img_address = `/uploads/${req.file.filename}`;
      setFields[`appData.${stationId}.img_address`] = img_address;
    }

    await Visitor.updateOne(
      { UID },
      {
        $set: setFields,
        $setOnInsert: { isInside: true },
      },
      { upsert: true }
    );

    const updated = await Visitor.findOne({ UID });
    const appInfo = updated?.appData?.[stationId] || {};

    // Notify UIs with the current authoritative data (name only first, then name+image later)
    req.io?.emit("visitor-updated", {
      UID,
      stationId,
      visitorData: {
        name: appInfo.name || null,
        img_address: appInfo.img_address || null,
        off: appInfo.off ?? false,
      },
    });

    return res.json({
      ok: true,
      message: hasFile ? "Visitor snapshot saved" : "Visitor name saved",
      img_address: appInfo.img_address || img_address || null,
    });
  } catch (err) {
    console.error("POST /visitors/data error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;
