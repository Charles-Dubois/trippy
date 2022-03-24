const express = require("express");
const router = express.Router();
const data = require("../APIKey.json");
const KeyModel = require("../models/APIKeyModel");
router.get("/", async (req, res) => {
  let userKey;
  try {
    userKey = await KeyModel.find(req.query);
    userKey = userKey[0].id;
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }

  res.json({
    username: req.query.username,
    key: userKey,
    message: `${req.query.username} you API Key is ${userKey}`,
  });
  // if (req.query.username) {
  //   const currentUser = data.find((user) => {
  //     return (
  //       user.username.toString().toLowerCase() ===
  //       req.query.username.toString().toLowerCase()
  //     );
  //   });
  //   if (!currentUser) {
  //     return res.status(400).json({
  //       error: "bad request 400",
  //       description: "this user does not exists",
  //     });
  //   }
  //   return res.json(currentUser);
  // }
  // res.send("Add query params username to show the API key which corresponds");
});
module.exports = router;
