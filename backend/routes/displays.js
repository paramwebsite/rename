const express = require("express");
const router = express.Router();

// POST /displays
router.delete("/:id", async (req, res) => {
  const displayId = req.params.id;

  try {
    const db = req.app.locals.db;
    const result = await db.run(`
      DELETE 
      FROM displays as d 
      WHERE d.id = ?
      `, [displayId]);

    res.json({ message: "Display Deleted", displayId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });

  try {
    const db = req.app.locals.db;
    const result = await db.run(`INSERT INTO displays (name) VALUES (?)`, [name]);
    res.json({ message: "Display registered", id: result.lastID, name });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /displays
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const rows = await db.all(`
      SELECT d.id, d.name, d.assigned_video_id,
             v.filename, v.original_name, v.uploaded_at
      FROM displays d
      LEFT JOIN videos v ON v.id = d.assigned_video_id
    `);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//get assigned Video Name
router.get("/:id/video", async (req, res) => {
     const displayId = req.params.id;
  try {
    const db = req.app.locals.db;
    const rows = await db.all(`
      SELECT d.id, d.name, d.assigned_video_id,
             v.filename, v.original_name, v.uploaded_at
      FROM displays d
      LEFT JOIN videos v ON v.id = d.assigned_video_id
      WHERE d.id = ?
    `,[displayId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /displays/:id/assign
router.put("/:id/assign", async (req, res) => {
  const displayId = req.params.id;
  const { videoId } = req.body;

  try {
    const db = req.app.locals.db;
    await db.run(`UPDATE displays SET assigned_video_id = ? WHERE id = ?`, [videoId, displayId]);
    const updated = await db.get(`
      SELECT d.id, d.name, v.id as video_id, v.filename,  v.original_name
      FROM displays d LEFT JOIN videos v ON v.id = d.assigned_video_id
      WHERE d.id = ?
    `, [displayId]);

     // 👇 notify display via socket.io room
    req.io.to(`display-${displayId}`).emit("videoChanged", updated);

    res.json({ message: "Assigned", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
