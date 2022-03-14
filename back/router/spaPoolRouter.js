const data = require("../hotels.json");
const express = require("express");
const router = express.Router();
const filterSpa = data.filter((hotel) => hotel.hasSpa);
const filterPool = data.filter((hotel) => hotel.hasPool);
const filterNoPool = data.filter((hotel) => !hotel.hasPool);
const filterNoSpa = data.filter((hotel) => !hotel.hasSpa);
const filterAny = filterNoPool.filter((hotel) => !hotel.hasSpa);
router.get("/", (_req, res) => {
  res.send(
    "add parmas to the endpoint to show the hotels with spa , pool or not, the possible params are :\n all\nany\nspa\npool\nnopool\nnospa"
  );
});

let result = "this value will change with the params";
router.get("/:type", (req, res) => {
  switch (req.params.type.toLowerCase()) {
    case "all":
      result = { Spa: filterSpa, Pool: filterPool };
      break;
    case "any":
      result = filterAny;
      break;
    case "spa":
      result = filterSpa;
      break;
    case "pool":
      result = filterNoPool;
      break;
    case "nopool":
      result = filterNoPool;
      break;
    case "nospa":
      result = filterNoSpa;
      break;
  }
  res.json(result);
});

module.exports = router;
