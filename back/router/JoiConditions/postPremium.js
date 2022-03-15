const Joi = require("joi");
const postPremium = Joi.object({
  username: Joi.string().min(3).max(30).required(),
});
module.exports = postPremium;
