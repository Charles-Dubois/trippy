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
  const addData = {
    id: data.length + 1,
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    hasSpa: req.body.hasSpa,
    hasPool: req.body.hasPool,
    stars: req.body.stars,
    priceCategory: req.body.priceCategory,
  };

  data.push(addData);
  res.status(201).json({ message: "Hotel added", description: addData });
});
// router.patch("/:id", (req, res) => {});
module.exports = router;
