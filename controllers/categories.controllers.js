const { selectAllCategories } = require("../models/categories.models");

exports.getCategories = (req, res, next) => {
  const { categories } = req.query;
  selectAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => next(err));
};
