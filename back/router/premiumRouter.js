const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello world");
});

router.post("/", (req, res) => {
  res.status(201).send("premium added");
});
module.exports = router;
