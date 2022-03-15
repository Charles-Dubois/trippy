const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const postPremium = require("./JoiConditions/postPremium");
const data = [];

function checkUsername(req, res, next) {
  const validation = postPremium.validate(req.body);
  if (validation.error) {
    return res.status(400).json({
      message: "error 400 bad request",
      description: validation.error.details[0].message,
    });
  }
  next();
}

router.post("/", checkUsername, (req, res) => {
  const userKey = { username: req.body.username, APIKey: uuidv4() };
  data.push(userKey);
  res.status(201).send({ message: "User added", details: userKey });
});
module.exports = router;