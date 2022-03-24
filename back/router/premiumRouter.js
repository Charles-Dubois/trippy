const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const postPremium = require("./JoiConditions/postPremium");
const data = require("../APIKey.json");
const KeyModel = require("../models/APIKeyModel");
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

router.post("/", checkUsername, async (req, res) => {
  let newKey;
  try {
    newKey = await KeyModel.create(req.body);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }

  res.json({ message: "Api key added", description: newKey });
  // const checkUsers = data.find((user) => {
  //   return (
  //     user.username.toString().toLowerCase() ===
  //     req.body.username.toString().toLowerCase()
  //   );
  // });

  // if (checkUsers) {
  //   return res.send(`the username ${checkUsers.username} already exists`);
  // }

  // const userKey = { username: req.body.username, api_key: uuidv4() };
  // data.push(userKey);

  // res.status(201).send({ message: "User added", details: userKey });
});
module.exports = router;
