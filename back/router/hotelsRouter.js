const data = require("../hotels.json");
const express = require("express");
const router = express.Router();
router.get("/", (_req, res) => {
  res.json(data);
});

router.get("/:id", (req, res) => {
  const hotelById = data.find((hotel) => {
    return hotel.id.toString() === req.params.id.toString();
  });

  res.json(hotelById);
});
module.exports = router;
