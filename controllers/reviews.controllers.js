const {
  selectReviewById,
  updateVotesById,
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
    .then((updatedReview) => {
      res.status(200).send({ updatedReview });
    })
    .catch((err) => next(err));
};
