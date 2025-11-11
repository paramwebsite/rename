const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// POST /videos/upload
router.post("/upload", upload.single("video"), async (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded");

    // Create uploads folder if it doesn't exist

    if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

    try {
        const db = req.app.locals.db; // we pass DB instance via app.locals
        const result = await db.run(
            `INSERT INTO videos (filename, original_name) VALUES (?, ?)`,
            [req.file.filename, req.file.originalname]
        );
        res.json({ message: "Video uploaded successfully!", file: req.file, videoId: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.delete("/:id", async (req, res) => {


    const videoId = req.params.id;

    try {
    const db = req.app.locals.db;

    // Get filename from DB first
    const video = await db.get(`SELECT filename FROM videos WHERE id = ?`, [videoId]);
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Delete file from uploads folder
    const filePath = path.join(__dirname, "../uploads", video.filename);
    if (fs.existsSync(filePath)){
        console.log(video.filename,"deleted")
        fs.unlinkSync(filePath);
    }


    // await db.run(`UPDATE displays SET assigned_video_id = ? WHERE id = ?`, [null, displayId]);
    // const updated = await db.get(`
    //   SELECT d.id, d.name, v.id as video_id, v.filename
    //   FROM displays d LEFT JOIN videos v ON v.id = d.assigned_video_id
    //   WHERE d.id = ?
    // `, [displayId]);

    //  // 👇 notify display via socket.io room
    // req.io.to(`display-${displayId}`).emit("videoChanged", updated);
        
        

    // Delete DB record
    await db.run(`DELETE FROM videos WHERE id = ?`, [videoId]);

    const fileName = video.filename;
    res.json({ message: "Video deleted successfully!",videoId,fileName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET /videos
router.get("/", async (req, res) => {
    try {
        const db = req.app.locals.db;
        const rows = await db.all(`SELECT id, filename, original_name, uploaded_at FROM videos ORDER BY uploaded_at DESC`);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
