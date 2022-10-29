const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const {
  getReviewById,
  addVotes,
  getReviewsSorted,
  getReviewByIdWithComments,
  addCommentByReviewId,
  deleteCommentByCommentId,
} = require("./controllers/reviews.controllers");
const { getUsers } = require("./controllers/users.controllers");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/users", getUsers);
app.patch("/api/reviews/:review_id", addVotes);
app.get("/api/reviews", getReviewsSorted);
app.get("/api/reviews/:review_id/comments", getReviewByIdWithComments);
app.post("/api/reviews/:review_id/comments", addCommentByReviewId);
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

// Error Handlers

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  let psqlErrors = ["22P02", "23502"];
  if (psqlErrors.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  let psqlErrors = ["23503"];
  if (psqlErrors.includes(err.code)) {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
