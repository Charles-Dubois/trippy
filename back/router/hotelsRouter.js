const data = require("../hotels.json");
const express = require("express");
const router = express.Router();
router.get("/", (_req, res) => {
  res.json(data);
});
module.exports = router;
