const express = require("express");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const hotelsRouter = require("./router/hotelsRouter");
const restaurantsRouter = require("./router/restaurantsRouter");
const premiumRouter = require("./router/premiumRouter");
const APIKey = require("./APIKey.json");
const app = express();
app.use(express.json());

const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});
let loggedIn = false;
function checkAPIKey(req, res, next) {
  let validation = "default value";
  if (APIKey.length < 1 && req.query.api_key) {
    return res.status(400).json({
      error: "400 bad request",
      description: "Any API are registered",
    });
  }
  if (req.query.api_key && APIKey.length > 0) {
    validation = APIKey.find((user) => user.api_key === req.query.api_key);
  }
  if (validation !== "default value") {
    if (!validation) {
      return res.status(400).json({
        error: "400 bad request",
        description: "this APi key is not valid",
      });
    }
    console.log(validation.api_key);
  }
  // TODO continuer ici : faire en sorte que quand la clé api correspond a une clé déjà entrée le nombre de requete possbile augment

  next();
}

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume()
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send("Requests limited to 100 per hour");
    });
};

app.get("/", checkAPIKey, rateLimiterMiddleware, (_req, res) => {
  res.send(
    "use the endpoint /hotels with method GET to show all hotels \n use the endpoint /hotels/:id with the method GET to see the hotel wich corresponds \n use the endpoint /hotels with method POST to add hotel \n use the endpoint /hotels/:id with the method DELETE to remove the hotel wich corresponds \n use the endpoint /hotels/:id with the method PATCH to change the hotel name \n \n use the endpoint /restaurants with method GET to show all restaurants \n use the endpoint /restaurants/:id with the method GET to see the restaurant wich corresponds \n use the endpoint /restautants with method POST to add restaurants \n use the endpoint /restaurants/:id with the method DELETE to remove the restaurant wich corresponds \n use the endpoint /restaurants/:id with the method PATCH to change the restaurant name  \n  "
  );
});
app.use("/hotels", rateLimiterMiddleware, hotelsRouter);
app.use("/restaurants", rateLimiterMiddleware, restaurantsRouter);
app.use("/premium", rateLimiterMiddleware, premiumRouter);
app.get("*", (_req, res) => {
  res.status(404).send("error 404");
});
app.listen(8000, () => {
  console.log("listening on port 8000");
});
