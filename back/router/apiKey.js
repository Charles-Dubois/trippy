const express = require("express");
const router = express.Router();
const data = require("../APIKey.json");

router.get("/", (req, res) => {
  if (req.query.username) {
    const currentUser = data.find((user) => {
      return (
        user.username.toString().toLowerCase() ===
        req.query.username.toString().toLowerCase()
      );
    });
    if (!currentUser) {
      return res.status(400).json({
        error: "bad request 400",
        description: "this user does not exists",
      });
    }

    return res.json(currentUser);
  }
  res.send("Add query params username to show the API key which corresponds");
});
module.exports = router;
// GET /api-key?username=marie
