const mongoose = require("mongoose");

const restaurantsShema = new mongoose.Schema({
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
  cuisine: {
    type: String,
    required: true,
    maxlegth: 100,
  },
  priceCategory: {
    type: Number,
    min: 1,
    max: 3,
  },
  comments: {
    type: [String],
    required: true,
  },
});

const Restaurant = mongoose.model("restaurants", restaurantsShema);
module.exports = Restaurant;
