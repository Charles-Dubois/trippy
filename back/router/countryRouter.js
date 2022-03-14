const dataHotels = require("../hotels.json");
const dataRestaurants = require("../restaurants.json");
const express = require("express");
const router = express.Router();
const infos =
  "select a country and choose between restaurants or hotels like this example \n france/restaurants\n france/hotels ";
router.get("/", (_req, res) => {
  res.send(infos);
});
router.get("/:country/:type", (req, res) => {
  const country = req.params.country;
  const type = req.params.type;
  let data =
    "this value will change whith the type of the researsh of the user";
  switch (type) {
    case "restaurants":
      data = dataRestaurants;
      break;
    case "hotels":
      data = dataHotels;
      break;
  }
  const filterCountry = data.filter(
    (element) => element.country.toLowerCase() === country.toLowerCase()
  );
  if (filterCountry.length < 1) {
    return res.json({
      error: `Any ${type} in ${country} are repertoried`,
      help: infos,
    });
  }

  res.json(filterCountry);
});

module.exports = router;
