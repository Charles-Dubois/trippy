// const data = require("../hotels.json");
const express = require("express");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const addHotel = require("./JoiConditions/addHotel");
const patchName = require("./JoiConditions/patchName");
const postComment = require("./JoiConditions/postComment");
const router = express.Router();
const dotenv = require("dotenv");
const Hotel = require("../models/hotelsModel");
const CommentHotel = require("../models/commentsHotelsModel");
dotenv.config({
  path: "./config.env",
});
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
//Routes

let indexHotel = "this value correspond to the index of the hotel selected";
let hotelById =
  "This value will change each time the user seach a restaurant by ID";
//middleware which return the element which correspond to the params
function handleHotelById(req, res, next) {
  checkId = data.find((hotel, index) => {
    indexHotel = index;
    return hotel.id.toString() === req.params.id.toString();
  });

  if (!checkId) {
    return res.status(400).json({
      error: "error 400 bad request",
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

router.get("/", async (_req, res) => {
  let hotels;
  try {
    hotels = await Hotel.find();
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  res.json(hotels);
  // let hotels;
  // try {
  //   hotels = await Postgres.query("SELECT * FROM hotels");
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).json({
  //     message: "Error",
  //   });
  // }
  // res.json(hotels.rows);
});

router.get("/:id", async (req, res) => {
  let hotel;
  try {
    hotel = await Hotel.findById(req.params.id);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  res.json(hotel);

  // let hotel;
  // try {
  //   hotel = await Postgres.query("SELECT * FROM hotels WHERE id = $1", [
  //     req.params.id,
  //   ]);
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).json({
  //     message: "Error",
  //   });
  // }
  // res.json(hotel.rows);
});

router.post("/", checkAddHotel, async (req, res) => {
  try {
    await Hotel.create(req.body);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  res.status(201).json({ message: "hotel added", description: req.body });

  // const add = req.body;
  // try {
  //   await Postgres.query(
  //     "INSERT INTO hotels(name, address, city, country, stars, hasSpa, hasPool, priceCategory, comments) VALUES($1, $2, $3, $4, $5, $6, $7, $8, ARRAY []::VARCHAR[]);",
  //     [
  //       add.name,
  //       add.address,
  //       add.city,
  //       add.country,
  //       add.stars,
  //       add.hasSpa,
  //       add.hasPool,
  //       add.priceCategory,
  //     ]
  //   );
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).json({
  //     message: "Error",
  //   });
  // }
  //   const added = await Postgres.query("SELECT * FROM hotels WHERE name =$1", [
  //     add.name,
  //   ]);

  //   res.json({
  //     message: "Hotel added !",
  //     description: added.rows,
  //   });

  //   res.status(201).json({ message: "Hotel added", description: addData });
});

router.patch("/:id", checkPatchName, async (req, res) => {
  try {
    await Hotel.updateOne(
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

  // try {
  //   await Postgres.query("UPDATE hotels SET name = $1 WHERE id= $2", [
  //     req.body.name,
  //     req.params.id,
  //   ]);
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).json({ message: "Error" });
  // }
  // res.send("Name changed");
});

// ================================================================================================ //
router.delete("/:id", async (req, res) => {
  try {
    await Hotel.findOneAndDelete(req.params.id);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  res.send("Hotel removed");

  // try {
  //   await Postgres.query("DELETE FROM hotels WHERE id = $1", [req.params.id]);
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).json({ message: "Error" });
  // }
  // res.send("restaurant removed!");
});
//*comments path

router.get("/:id/comments/", async (req, res) => {
  let comments;
  try {
    comments = await CommentHotel.find(req.params);
    comments = comments;
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  res.json(comments);

  // const comments = hotelById.comments;
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
  let theHotel;
  try {
    theHotel = await Hotel.findById(req.params.id);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  if (theHotel) {
    const TheNewComment = {
      idHotel: theHotel.id,
      username: req.body.username,
      text: req.body.text,
    };

    try {
      await CommentHotel.create(TheNewComment);
    } catch (err) {
      console.log(err);
      return res.status(400).send("error 400");
    }
  } else {
    return res.send("this id of hotel does not exists");
  }
  res.json({ message: "comments added" });

  // const comment = {
  //   id: uuidv4(),
  //   username: req.body.username,
  //   text: req.body.text,
  // };

  // hotelById.comments.push(comment);
  // res.status(201).json({ message: "comment added", description: comment });
});

router.delete("/:id/comments/:idComment", async (req, res) => {
  try {
    await CommentHotel.findOneAndDelete(req.params.id);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error 400");
  }
  res.send("comment removed");
  // checkIdComment = hotelById.comments.find((comment, index) => {
  //   indexComment = index;
  //   return comment.id.toString() === req.params.idComment.toString();
  // });
  // if (!checkIdComment) {
  //   return res.status(400).json({
  //     error: "error 400 bad request",
  //     description: `${req.params.idComment} id comment does not exists`,
  //   });
  // }
  // hotelById.comments.splice(indexComment, 1);
  // res.send(hotelById);
});

module.exports = router;
