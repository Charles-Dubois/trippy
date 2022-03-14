const data = require("../hotels.json");
const express = require("express");
const router = express.Router();
router.get("/", (_req, res) => {
  const filterSpa = data.filter((hotel) => hotel.hasSpa);
  const filterPool = data.filter((hotel) => hotel.hasPool);
  if (!filterSpa && !filterPool) {
    return res.send("Any hotel with spa or pool found");
  }
  if (filterSpa && filterPool) {
    return res.json({ Spa: filterSpa, Pool: filterPool });
  } else if (filterSpa) {
    return res.json(filterSpa);
  } else if (filterPool) {
    return res.json(filterPool);
  }
});

module.exports = router;
