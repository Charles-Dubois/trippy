const data = require("../restaurants.json");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const patchName = require("./JoiConditions/patchName");
const addRestaurant = require("./JoiConditions/addRestaurant");
const postComment = require("./JoiConditions/postComment");
const Restaurant = require("../models/restaurantsModel");
const CommentRestaurant = require("../models/commentsRestaurantsModel");
let indexRestaurant =
  "this value correspond to the index of the restaurant selected";
let indexComment = "this value correspond to the index of the comment selected";
let restaurantById =
  "This value will change each time the user seach a restaurant by ID";
//middleware which return the element which correspond to the params
function handleRestaurantById(req, res, next) {
  checkId = data.find((restaurant, index) => {
    indexRestaurant = index;
    return restaurant.id.toString() === req.params.id.toString();
  });

  if (!checkId) {
    return res.status(400).json({
      error: "error 400 bad request",
      description: `${req.params.id} id does not exists`,
    });
  }
  restaurantById = checkId;
  next();
}
// middleware method POST with checking Joi condition
function checkAddRestaurant(req, res, next) {
  const validation = addRestaurant.validate(req.body);
  if (validation.error) {
    return res.status(400).json({
      message: "error 400 bad request",
      description: validation.error.details[0].message,
    });
  }
  next();
}
// middleware method PATCH with checking Joi condition
function checkPatchName(req, res, next) {
  const validation = patchName.validate(req.body);
  if (validation.error) {
    return res.status(400).json({
      message: "error 400 bad request",
      description: validation.error.details[0].message,
    });
  }
  next();
}

function checkPostComment(req, res, next) {
  const validation = postComment.validate(req.body);
  if (validation.error) {
    return res.status(400).json({
      message: "error 400 bad request",
      description: validation.error.details[0].message,
    });
  }
  next();
}

router.get("/", async (req, res) => {
  let restaurants;

  try {
    restaurants = await Restaurant.find();
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  res.json(restaurants);
  // let queryData = data;
  // const queryParams = [
  //   "country",
  //   "priceCategory",
  //   "name",
  //   "address",
  //   "city",
  //   "stars",
  //   "cuisine",
  //   "priceCategory",
  // ];
  // for (let queryLoop = 0; queryLoop < queryParams.length; queryLoop++) {
  //   let currentLoop = queryParams[queryLoop];
  //   if (req.query[currentLoop]) {
  //     queryData = queryData.filter(
  //       (element) =>
  //         element[currentLoop].toString().toLowerCase() ===
  //         req.query[currentLoop].toString().toLowerCase()
  //     );
  //   }
  // }
  // res.json(queryData);
});
router.get("/:id", async (req, res) => {
  let restaurant;
  try {
    restaurant = await Restaurant.findById(req.params.id);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  res.json(restaurant);
  //* exemple of id : 623b3c8669de9533bda1e1c5 , 623b3d667ba07ef88f748522
  // res.json({ restaurantById });
});

router.post("/", checkAddRestaurant, async (req, res) => {
  try {
    await Restaurant.create(req.body);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  res.status(201).json({ message: "restaurant added", description: req.body });
  // const addData = {
  //   id: data[data.length - 1].id + 1,
  //   name: req.body.name,
  //   address: req.body.address,
  //   city: req.body.city,
  //   country: req.body.country,
  //   cuisine: req.body.cuisine,
  //   stars: req.body.stars,
  //   priceCategory: req.body.priceCategory,
  // };
  // data.push(addData);
  // res.status(201).json({ message: "restaurant added", description: addData });
});

router.patch("/:id", checkPatchName, async (req, res) => {
  try {
    await Restaurant.updateOne(
      { id: req.params.id },
      {
        name: req.body.name,
      }
    ).select("name");
  } catch (err) {
    console.log(err);
    console.log(req.body.name);
    return res.status(400).send("error 400");
  }
  res.json({ message: "name changed !" });
  // restaurantById.name = req.body.name;
  // res.json({ message: "name changed", description: restaurantById });
});
router.delete("/:id", handleRestaurantById, (_req, res) => {
  data.splice(indexRestaurant, 1);

  res.json(data);
});
//*comments path

router.get("/:id/comments/", async (req, res) => {
  let comments;
  try {
    comments = await CommentRestaurant.find(req.params);
    comments = comments;
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  res.json(comments);
  // const comments = restaurantById.comments;
  // let currentComments = [];
  // const limit = parseInt(req.query.limit);

  // if (limit) {
  //   for (let i = limit - 1; i >= 0; i--) {
  //     if (comments[i]) {
  //       currentComments.push(comments[i]);
  //     }
  //   }
  // }
  // if (comments.length < 1) {
  //   return res.send("Any comments addeds");
  // }
  // if (currentComments.length > 0) {
  //   return res.json(currentComments);
  // }
  // res.json(comments);
});
router.post("/:id/comments/", checkPostComment, async (req, res) => {
  let theRestaurant;
  try {
    theRestaurant = await Restaurant.findById(req.params.id);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  if (theRestaurant) {
    const TheNewComment = {
      idRestaurant: theRestaurant.id,
      username: req.body.username,
      text: req.body.text,
    };

    try {
      await CommentRestaurant.create(TheNewComment);
    } catch (err) {
      console.log(err);
      return res.status(400).send("error 400");
    }
  } else {
    return res.send("this id of restaurant does not exists");
  }
  res.json({ message: "comments added" });

  // restaurantById.comments.push(comment);
  // res.status(201).json({ message: "comment added", description: comment });
});

router.delete("/:id/comments/:idComment", async (req, res) => {
  //* mongoDB
  try {
    await CommentRestaurant.findOneAndDelete(req.params.id);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  res.send("comment removed");
  // checkIdComment = restaurantById.comments.find((comment, index) => {
  //   indexComment = index;
  //   return comment.id.toString() === req.params.idComment.toString();
  // });
  // if (!checkIdComment) {
  //   return res.status(400).json({
  //     error: "error 400 bad request",
  //     description: `${req.params.idComment} id comment does not exists`,
  //   });
  // }
  // restaurantById.comments.splice(indexComment, 1);
  // res.send(restaurantById);
});

module.exports = router;
