const express = require("express");
const app = express();
app.use(express.json());
app.get("/", (_req, res) => {
  res.send("hello");
});
app.get("*", (_req, res) => {
  res.status(404).send("error 404");
});
app.listen(8000, () => {
  console.log("listening on port 8000");
});
