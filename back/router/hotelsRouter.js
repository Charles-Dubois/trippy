const data = require("../hotels.json");
const express = require("express");
const Joi = require("joi");
const addHotel = require("./JoiConditions/addHotel");
const router = express.Router();

let hotelById =
  "This value will change each time the user seach a restaurant by ID";
//middleware method GET by ID
function handleHotelById(req, res, next) {
  checkId = data.find((hotel) => {
    return hotel.id.toString() === req.params.id.toString();
  });

  if (!checkId) {
    return res.status(400).json({
      error: "error400 bad request",
      description: `${req.params.id} id does not exists`,
    });
  }
  hotelById = checkId;
  next();
}
// middleware method POST
function checkAddHotel(req, res, next) {
  const validation = addHotel.validate(req.body);
  if (validation.error) {
    return res.status(400).json({
      message: "error 400 bad request",
      description: validation.error.details[0].message,
    });
  }
  next();
}

router.get("/", (_req, res) => {
  res.json(data);
});

router.get("/:id", handleHotelById, (req, res) => {
  res.json(hotelById);
});

router.post("/", checkAddHotel, (req, res) => {
  res.status(201).json({ message: "Hotel added", description: req.body });
});
// router.patch("/:id", (req, res) => {});
module.exports = router;
