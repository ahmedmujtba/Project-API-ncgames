const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const app = express();

app.get("/api/categories", getCategories);

//Error Handlers
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
