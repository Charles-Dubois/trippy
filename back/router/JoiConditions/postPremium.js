const Joi = require("joi");
const patchName = Joi.object({
  username: Joi.string().min(3).max(30).required(),
});
module.exports = patchName;
