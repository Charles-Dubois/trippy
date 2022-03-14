const express = require("express");
const hotelsRouter = require("./router/hotelsRouter");
const restaurantsRouter = require("./router/restaurantsRouter");
const countryRouter = require("./router/countryRouter");
const priceRouter = require("./router/priceRouter");
const app = express();

app.use(express.json());
app.get("/", (_req, res) => {
  res.send(
    "use the endpoint /hotels with method GET to show all hotels \n use the endpoint /hotels/:id with the method GET to see the hotel wich corresponds \n use the endpoint /hotels with method POST to add hotel \n use the endpoint /hotels/:id with the method DELETE to remove the hotel wich corresponds \n use the endpoint /hotels/:id with the method PATCH to change the hotel name \n \n use the endpoint /restaurants with method GET to show all restaurants \n use the endpoint /restaurants/:id with the method GET to see the restaurant wich corresponds \n use the endpoint /restautants with method POST to add restaurants \n use the endpoint /restaurants/:id with the method DELETE to remove the restaurant wich corresponds \n use the endpoint /restaurants/:id with the method PATCH to change the restaurant name  \n \n"
  );
});

app.use("/hotels", hotelsRouter);
app.use("/restaurants", restaurantsRouter);
app.use("/country", countryRouter);
app.use("/price", priceRouter);
app.get("*", (_req, res) => {
  res.status(404).send("error 404");
});
app.listen(8000, () => {
  console.log("listening on port 8000");
});
