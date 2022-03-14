const data = require("../hotels.json");
const express = require("express");
const Joi = require("joi");
const router = express.Router();
let hotelById = "";
function handleHotelById(req, res, next) {
  checkId = data.find((hotel) => {
    return hotel.id.toString() === req.params.id.toString();
  });

  if (!checkId) {
    return res
      .status(400)
      .json({
        error: "error400 bad request",
        description: `${req.params.id} id does not exists`,
      });
  }
  hotelById = checkId;
  next();
}

router.get("/", (_req, res) => {
  res.json(data);
});

router.get("/:id", handleHotelById, (req, res) => {
  res.json(hotelById);
});
// router.patch("/:id", (req, res) => {});
module.exports = router;
