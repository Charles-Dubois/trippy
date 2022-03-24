const mongoose = require("mongoose");

const keySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 100,
    minlength: 3,
    unique: true,
  },
});
const KeyModel = mongoose.model("API-keys", keySchema);
module.exports = KeyModel;
