const express = require("express");
const hotelsRouter = require("./router/hotelsRouter");
const restaurantsRouter = require("./router/restaurantsRouter");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const app = express();
const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60, // per 30 seconds
});
app.use(express.json());
app.get("/", (_req, res) => {
  res.send(
    "use the endpoint /hotels with method GET to show all hotels \n use the endpoint /hotels/:id with the method GET to see the hotel wich corresponds \n use the endpoint /hotels with method POST to add hotel \n use the endpoint /hotels/:id with the method DELETE to remove the hotel wich corresponds \n use the endpoint /hotels/:id with the method PATCH to change the hotel name \n \n use the endpoint /restaurants with method GET to show all restaurants \n use the endpoint /restaurants/:id with the method GET to see the restaurant wich corresponds \n use the endpoint /restautants with method POST to add restaurants \n use the endpoint /restaurants/:id with the method DELETE to remove the restaurant wich corresponds \n use the endpoint /restaurants/:id with the method PATCH to change the restaurant name  \n  "
  );
});

const rateLimiterMiddleware = (_req, res, next) => {
  rateLimiter
    .consume()
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send("Requests limited to 100 per hour");
    });
};
app.use("/hotels", rateLimiterMiddleware, hotelsRouter);
app.use("/restaurants", rateLimiterMiddleware, restaurantsRouter);

app.get("*", (_req, res) => {
  res.status(404).send("error 404");
});
app.listen(8000, () => {
  console.log("listening on port 8000");
});
