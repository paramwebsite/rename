


const express = require("express");
const router = express.Router();



router.get("/:filename", async (req, res) => {
  
  res.sendFile(path.resolve(`uploads/${req.params.filename}`));
});





module.exports = router;
