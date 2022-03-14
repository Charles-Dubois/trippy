const Joi = require("joi");
const addRestaurant = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  address: Joi.string().min(3).max(50).required(),
  city: Joi.string().alphanum().min(3).max(20).required(),
  country: Joi.string().min(3).max(20).required(),
  stars: Joi.number().integer().min(1).max(5),
  cuisine: Joi.string().alphanum().min(3).max(30).required(),
  priceCategory: Joi.number().integer().min(1).max(3).required(),
});
module.exports = addRestaurant;
