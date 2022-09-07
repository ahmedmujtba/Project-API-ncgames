const { selectAllUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  const { users } = req.query;
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};
