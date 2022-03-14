const Joi = require("joi");
const patchName = Joi.object({
  name: Joi.string().min(3).max(30).required(),
});
module.exports = patchName;
