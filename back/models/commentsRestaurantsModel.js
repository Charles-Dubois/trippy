const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  idRestaurant: {
    type: String,
    required: true,
    maxlength: 100,
  },
  username: {
    type: String,
    required: true,
    maxlength: 100,
    minlength: 3,
  },
  text: {
    type: String,
    required: true,
    maxlength: 250,
    minlength: 3,
  },
});

const CommentRestaurant = mongoose.model(
  "restaurants-comments",
  commentsSchema
);

module.exports = CommentRestaurant;
