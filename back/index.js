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
    "use the endpoint /hotels with method GET to show all hotels \n\n use the endpoint /hotels/:id with the method GET to see the hotel which corresponds to the id\n example : 'http://localhost:8000/hotels/2' \n\n use the endpoint /hotels with method POST to add hotel in the list, you have to send json \n\n use the endpoint /hotels/:id with the method DELETE to remove the hotel wich corresponds to this id\n example : /hotels/2 \n\n use the endpoint /hotels/:id with the method PATCH to change the hotel name \n\nwith the GET method you can add the endpoint /comments after a hotel id to see the comments\nexample: 'http://localhost:8000/hotels/3/comments'\nstill at this uri, with the POST method you can add a comment, you have to send json\n\n you can show a comment by id with GET method \nexample : 'http://localhost:8000/hotels/3/comments/TheIdOfTheComment'\n\n\n\n\n replace hotels by restaurants to do the same things whith the restaurants\nexapmle : 'http://localhost:8000/restaurants/' \n\n\n\n use the endpoint /premium with POST method to generete a new key api, you have to send json \n\n use the endpoint /api-key with GET method to show your key api you have to put in query params your username\nexample : 'http://localhost:8000/api-key/?username=michel'"
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
