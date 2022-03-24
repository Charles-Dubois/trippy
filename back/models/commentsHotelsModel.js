const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  idHotel: {
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

const CommentHotel = mongoose.model("hotels-comments", commentsSchema);

module.exports = CommentHotel;
