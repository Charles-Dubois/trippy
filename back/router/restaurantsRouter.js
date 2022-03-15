const data = require("../restaurants.json");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const patchName = require("./JoiConditions/patchName");
const addRestaurant = require("./JoiConditions/addRestaurant");

let indexRestaurant =
  "this value correspond to the index of the restaurant selected";
let restaurantById =
  "This value will change each time the user seach a restaurant by ID";
//middleware who return the element which correspond to the params
function handleRestaurantById(req, res, next) {
  checkId = data.find((restaurant, index) => {
    indexRestaurant = index;
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
// middleware method POST with checking Joi condition
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

router.get("/", (req, res) => {
  let queryData = data;

  const queryParams = [
    "country",
    "priceCategory",
    "name",
    "address",
    "city",
    "stars",
    "cuisine",
    "priceCategory",
  ];
  for (let queryLoop = 0; queryLoop < queryParams.length; queryLoop++) {
    let currentLoop = queryParams[queryLoop];
    if (req.query[currentLoop]) {
      let actualQuery = req.query[currentLoop];
      console.log(actualQuery);
      console.log(currentLoop);

      queryData = queryData.filter(
        (element) =>
          element[currentLoop].toString().toLowerCase() ===
          req.query[currentLoop].toString().toLowerCase()
      );
    }
  }
  res.json(queryData);
});
router.get("/:id", handleRestaurantById, (_req, res) => {
  res.json({ restaurantById });
});

router.post("/", checkAddRestaurant, (req, res) => {
  const addData = {
    id: data[data.length - 1].id + 1,
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

router.patch("/:id", handleRestaurantById, checkPatchName, (req, res) => {
  restaurantById.name = req.body.name;
  res.json({ message: "name changed", description: restaurantById });
});
router.delete("/:id", handleRestaurantById, (_req, res) => {
  data.splice(indexRestaurant, 1);

  res.json(data);
});
module.exports = router;
