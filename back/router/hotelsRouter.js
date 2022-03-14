const data = require("../hotels.json");
const express = require("express");
const Joi = require("joi");
const addHotel = require("./JoiConditions/addHotel");
const patchName = require("./JoiConditions/patchName");
const router = express.Router();
const spaPoolRouter = require("./spaPoolRouter");
let indexHotel = "this value correspond to the index of the hotel selected";
let hotelById =
  "This value will change each time the user seach a restaurant by ID";
//middleware who return the element which correspond to the params
function handleHotelById(req, res, next) {
  checkId = data.find((hotel, index) => {
    indexHotel = index;
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
// middleware method POST with checking Joi condition
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
// middleware method PATCH with checking Joi condition
function checkPatchName(req, res, next) {
  const validation = patchName.validate(req.body);
  if (validation.error) {
    return res.status(400).json({
      message: "error 400 bad request",
      description: validation.error.details[0].message,
    });
  }
  next();
}
router.use("/spaPool", spaPoolRouter);
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

router.patch("/:id", handleHotelById, checkPatchName, (req, res) => {
  hotelById.name = req.body.name;
  res.json({ message: "name changed", description: hotelById });
});

router.delete("/:id", handleHotelById, (_req, res) => {
  data.splice(indexHotel, 1);

  res.json(data);
});

module.exports = router;
