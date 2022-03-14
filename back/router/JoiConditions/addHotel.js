const Joi = require("joi");
const addHotel = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  address: Joi.string().min(3).max(50).required(),
  city: Joi.string().alphanum().min(3).max(20).required(),
  country: Joi.string().min(3).max(20).required(),
  stars: Joi.number().integer().min(1).max(5),
  hasSpa: Joi.boolean().required(),
  hasPool: Joi.boolean().required(),
  priceCategory: Joi.number().integer().min(1).max(3).required(),
});
module.exports = addHotel;
