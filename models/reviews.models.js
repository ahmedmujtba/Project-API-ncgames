const db = require("../db/connection");

exports.selectReviewById = (id) => {
  return db
    .query(
      `SELECT reviews.review_id, title, designer, owner, review_img_url, review_body, category, reviews.created_at, reviews.votes, COUNT (comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
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

exports.selectReviewsSorted = (
  sort_by = "created_at",
  order = "DESC",
  category
) => {
  const validSortBy = [
    "created_at",
    "owner",
    "title",
    "category",
    "votes",
    "designer",
    "comment_count",
  ];
  const validOrder = ["DESC", "ASC"];
  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let qrstr = `SELECT reviews.review_id, title, designer, owner, review_img_url, category, reviews.created_at, reviews.votes, COUNT (comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;
  queryValues = [];
  if (category) {
    qrstr += ` WHERE category = $1`;
    queryValues.push(qrstr);
  }
  qrstr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`;
  return db.query(qrstr, queryValues).then((result) => {
    return result.rows;
  });
};

exports.selectReviewByIdWithComments = (id) => {
  return db
    .query(
      `SELECT review_id, comment_id, votes, created_at, author, body FROM comments WHERE review_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows;
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

exports.postCommentById = (id, comment) => {
  if (typeof comment !== "object") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return db
      .query(
        `INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
        [id, comment.username, comment.body]
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
