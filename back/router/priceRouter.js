const dataHotels = require("../hotels.json");
const dataRestaurants = require("../restaurants.json");
const express = require("express");
const router = express.Router();

const infos =
  "select a price category between 1 and 3 and choose between restaurants or hotels like this example \n 1/restaurants\n 2/hotels ";
router.get("/", (_req, res) => {
  res.send(infos);
});
router.get("/:price/:type", (req, res) => {
  const priceCategory = req.params.price;
  const type = req.params.type;
  let data =
    "this value will change whith the type of the researsch of the user";
  switch (type.toLowerCase()) {
    case "restaurants":
      data = dataRestaurants;
      break;
    case "hotels":
      data = dataHotels;
      break;
  }

  const filterPrice = data.filter(
    (element) => element.priceCategory.toString() === priceCategory.toString()
  );
  if (filterPrice.length < 1) {
    return res.json({
      error: `Any ${type} in the price category ${priceCategory} are repertoried`,
      help: infos,
    });
  }

  res.json(filterPrice);
});

module.exports = router;
