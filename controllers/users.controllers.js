const { selectAllUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  selectAllUsers(req)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};
