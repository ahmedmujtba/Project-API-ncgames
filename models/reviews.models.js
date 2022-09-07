const db = require("../db/connection");

exports.selectReviewById = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

exports.updateVotesById = (id, votes) => {
  return db
    .query(
      `UPDATE reviews SET votes = $1 + votes WHERE review_id = $2 RETURNING *;`,
      [votes, id]
    )
    .then((rows) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};
