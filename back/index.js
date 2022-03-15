const express = require("express");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const hotelsRouter = require("./router/hotelsRouter");
const restaurantsRouter = require("./router/restaurantsRouter");
const premiumRouter = require("./router/premiumRouter");
const apiRouter = require("./router/apiKey");
const APIKey = require("./APIKey.json");

const app = express();
app.use(express.json());

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60,
});

const rateLimiterPremium = new RateLimiterMemory({
  points: 20,
  duration: 60,
});
let loggedIn = false;
function checkAPIKey(req, res, next) {
  loggedIn = false;
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
    loggedIn = true;
  }

  next();
}

const rateLimiterMiddleware = (req, res, next) => {
  const checkPremium = () => {
    if (loggedIn) {
      return rateLimiterPremium;
    } else {
      return rateLimiter;
    }
  };
  checkPremium()
    .consume()
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send("Too many requests");
    });
};

app.get("/", checkAPIKey, (_req, res) => {
  res.send(
    "use the endpoint /hotels with method GET to show all hotels \n use the endpoint /hotels/:id with the method GET to see the hotel wich corresponds \n use the endpoint /hotels with method POST to add hotel \n use the endpoint /hotels/:id with the method DELETE to remove the hotel wich corresponds \n use the endpoint /hotels/:id with the method PATCH to change the hotel name \n \n use the endpoint /restaurants with method GET to show all restaurants \n use the endpoint /restaurants/:id with the method GET to see the restaurant wich corresponds \n use the endpoint /restautants with method POST to add restaurants \n use the endpoint /restaurants/:id with the method DELETE to remove the restaurant wich corresponds \n use the endpoint /restaurants/:id with the method PATCH to change the restaurant name  \n \n use the endpoint /premium with POST method to generete a new key api \n use the endpoint /api-key with GET method to show your key api "
  );
});
app.use("/hotels", checkAPIKey, rateLimiterMiddleware, hotelsRouter);
app.use("/restaurants", checkAPIKey, rateLimiterMiddleware, restaurantsRouter);
app.use("/premium", checkAPIKey, premiumRouter);
app.use("/api-key", checkAPIKey, apiRouter);
app.get("*", (_req, res) => {
  res.status(404).send("error 404");
});
app.listen(8000, () => {
  console.log("listening on port 8000");
});

// Enfin, ajoutez une route GET /api-key?username=marie qui permettra à un client de récupérer sa clé api à
//  l’aide de son nom d’utilisateur, afin de pouvoir commencer à faire des
//  requêtes (cela ressemble à un système de login).
