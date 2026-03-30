import express from "express";

const router = express.Router();

/**
 * POST /health
 *
 * Expected body:
 * {
 *   stationId: String,
 *   type: String,
 *   metrics: Object,
 *   errors: [{ level: "log|warning|error", message: String }],
 *   status: "ok|warning|error",
 *   meta: Object
 * }
 */
router.post("/", async (req, res) => {
  try {
    const {
      stationId,
      type,
      metrics = {},
      errors = [],
      status,
      meta = {},
    } = req.body;

    // 🔒 Minimal validation
    if (!stationId || !type || !status) {
      return res.status(400).json({
        ok: false,
        error: "stationId, type, and status are required",
      });
    }

    const payload = {
      stationId,
      type,
      metrics,
      errors,
      status,
      meta,
      timestamp: new Date().toISOString(),
    };

    // 🔁 Forward to DB server (if configured)
    if (process.env.HEALTH_DB_URL) {
      await fetch(process.env.HEALTH_DB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // Optional: local log if no DB URL is set
      console.log("📡 Health received:", payload);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("❌ /health failed:", err);
    res.status(500).json({ ok: false });
  }
});

export default router;
