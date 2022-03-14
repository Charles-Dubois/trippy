const data = require("../restaurants.json");
const express = require("express");
const router = express.Router();

let restaurantById = "";
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

router.get("/", (_req, res) => {
  res.json(data);
});
router.get("/:id", handleRestaurantById, (req, res) => {
  res.json(restaurantById);
});
module.exports = router;
