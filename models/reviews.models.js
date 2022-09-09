const db = require("../db/connection");

exports.selectReviewById = (id) => {
  return db
    .query(
      `SELECT reviews.review_id, title, designer, owner, review_img_url, review_body, category, reviews.created_at, reviews.votes, COUNT (comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        console.log(rows[0]);
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

exports.updateVotesById = (id, votes) => {
  if (typeof votes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return db
      .query(
        `UPDATE reviews SET votes = $1 + votes WHERE review_id = $2 RETURNING *;`,
        [votes, id]
      )
      .then(({ rows }) => {
        if (rows.length > 0) {
          return rows[0];
        } else {
          return Promise.reject({ status: 404, msg: "Not Found" });
        }
      });
  }
};

exports.selectReviewWIthCommentCount = () => {};
