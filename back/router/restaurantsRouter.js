const data = require("../restaurants.json");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const addRestaurant = require("./JoiConditions/addRestaurant");
let restaurantById =
  "This value will change each time the user seach a restaurant by ID";
function handleRestaurantById(req, res, next) {
  checkId = data.find((restaurant) => {
    return restaurant.id.toString() === req.params.id.toString();
  });

  if (!checkId) {
    return res.status(400).json({
      error: "error 400 bad request",
      description: `${req.params.id} id does not exists`,
    });
  }
  restaurantById = checkId;
  next();
}

function checkAddRestaurant(req, res, next) {
  const validation = addRestaurant.validate(req.body);
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
router.get("/:id", handleRestaurantById, (req, res) => {
  res.json({ restaurantById });
});

router.post("/", checkAddRestaurant, (req, res) => {
  const addData = {
    id: data.length + 1,
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    cuisine: req.body.cuisine,
    stars: req.body.stars,
    priceCategory: req.body.priceCategory,
  };

  data.push(addData);
  res.status(201).json({ message: "restaurant added", description: addData });
});
module.exports = router;
