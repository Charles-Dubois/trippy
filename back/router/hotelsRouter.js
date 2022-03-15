const data = require("../hotels.json");
const express = require("express");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const addHotel = require("./JoiConditions/addHotel");
const patchName = require("./JoiConditions/patchName");
const postComment = require("./JoiConditions/postComment");
const router = express.Router();

const { query } = require("express");
let indexHotel = "this value correspond to the index of the hotel selected";
let hotelById =
  "This value will change each time the user seach a restaurant by ID";
//middleware who return the element which correspond to the params
function handleHotelById(req, res, next) {
  checkId = data.find((hotel, index) => {
    indexHotel = index;
    return hotel.id.toString() === req.params.id.toString();
  });

  if (!checkId) {
    return res.status(400).json({
      error: "error400 bad request",
      description: `${req.params.id} id does not exists`,
    });
  }
  hotelById = checkId;
  next();
}
// middleware method POST with checking Joi condition
function checkAddHotel(req, res, next) {
  const validation = addHotel.validate(req.body);
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

router.get("/", (req, res) => {
  let queryData = data;
  const queryParams = [
    "country",
    "priceCategory",
    "name",
    "address",
    "city",
    "stars",
    "hasSpa",
    "hasPool",
    "priceCategory",
  ];
  for (let queryLoop = 0; queryLoop < queryParams.length; queryLoop++) {
    let currentLoop = queryParams[queryLoop];
    if (req.query[currentLoop]) {
      let actualQuery = req.query[currentLoop];

      queryData = queryData.filter(
        (element) =>
          element[currentLoop].toString().toLowerCase() ===
          req.query[currentLoop].toString().toLowerCase()
      );
    }
  }
  res.json(queryData);
});

router.get("/:id", handleHotelById, (req, res) => {
  res.json(hotelById);
});

router.post("/", checkAddHotel, (req, res) => {
  const addData = {
    id: data[data.length - 1].id + 1,
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    hasSpa: req.body.hasSpa,
    hasPool: req.body.hasPool,
    stars: req.body.stars,
    priceCategory: req.body.priceCategory,
  };

  data.push(addData);
  res.status(201).json({ message: "Hotel added", description: addData });
});

router.patch("/:id", handleHotelById, checkPatchName, (req, res) => {
  hotelById.name = req.body.name;
  res.json({ message: "name changed", description: hotelById });
});

router.delete("/:id", handleHotelById, (_req, res) => {
  data.splice(indexHotel, 1);

  res.json(data);
});
//*comments path

router.get("/:id/comments/", handleHotelById, (_req, res) => {
  const comments = hotelById.comments;
  if (comments.length < 1) {
    return res.send("Any comments addeds");
  }
  res.json(comments);
});
router.post("/:id/comments/", handleHotelById, checkPostComment, (req, res) => {
  const comment = {
    id: uuidv4(),
    username: req.body.username,
    text: req.body.text,
  };

  hotelById.comments.push(comment);
  res.status(201).json({ message: "comment added", description: comment });
});

router.delete("/:id/comments/:idComment", handleHotelById, (req, res) => {
  checkIdComment = hotelById.comments.find((comment, index) => {
    indexComment = index;
    return comment.id.toString() === req.params.idComment.toString();
  });
  if (!checkIdComment) {
    return res.status(400).json({
      error: "error 400 bad request",
      description: `${req.params.idComment} id comment does not exists`,
    });
  }
  hotelById.comments.splice(indexComment, 1);
  res.send(hotelById);
});

module.exports = router;
