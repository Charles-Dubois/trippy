const mongoose = require("mongoose");

const hotelsShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlegth: 50,
  },
  address: {
    type: String,
    required: true,
    maxlegth: 100,
  },
  city: {
    type: String,
    required: true,
    maxlegth: 30,
  },
  country: {
    type: String,
    required: true,
    maxlegth: 30,
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
  },
  hasSpa: {
    type: Boolean,
    required: true,
  },
  hasPool: {
    type: Boolean,
    required: true,
  },
  priceCategory: {
    type: Number,
    min: 1,
    max: 3,
  },
});

const Hotel = mongoose.model("hotels", hotelsShema);
module.exports = Hotel;
