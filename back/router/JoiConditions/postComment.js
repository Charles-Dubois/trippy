const Joi = require("joi");
const postComment = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  text: Joi.string().min(3).max(140).required(),
});
module.exports = postComment;
