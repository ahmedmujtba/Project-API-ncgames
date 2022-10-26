const {
  selectReviewById,
  updateVotesById,
  selectReviewsSorted,
  selectReviewByIdWithComments,
  postCommentById,
} = require("../models/reviews.models");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => next(err));
};

exports.addVotes = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateVotesById(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => next(err));
};

exports.getReviewsSorted = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  selectReviewsSorted(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewByIdWithComments = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewByIdWithComments(review_id)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const comment = req.body;
  postCommentById(review_id, comment)
    .then((review) => {
      res.status(201).send({ comment: review });
    })
    .catch((err) => {
      next(err);
    });
};
