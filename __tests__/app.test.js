const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const allData = require("../db/data/test-data/index");
const { string } = require("pg-format");

afterAll(() => {
  return db.end();
});
beforeEach(() => {
  return seed(allData);
});

describe("/api/categories", () => {
  describe("GET", () => {
    test("200: should return an array of category objects with slug and description properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(body.categories).toBeInstanceOf(Array);
          expect(body.categories).not.toHaveLength(0);
          body.categories.forEach((category) => {
            expect(category).toHaveProperty("slug", expect.any(String));
            expect(category).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });
});
describe("/api/reviews/:review_id", () => {
  describe("GET", () => {
    test("200: should return a review object with following properties: review_id, title, review_body, designer, review_img_url, votes, category (references slug in categories), owner (references users primary key i.e. username), created_at ", () => {
      return request(app)
        .get("/api/reviews/6")
        .expect(200)
        .then(({ body }) => {
          const testReview = {
            review_id: 6,
            title: "Occaecat consequat officia in quis commodo.",
            designer: "Ollie Tabooger",
            owner: "mallionaire",
            review_img_url:
              "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            review_body:
              "Fugiat fugiat enim officia laborum quis. Aliquip laboris non nulla nostrud magna exercitation in ullamco aute laborum cillum nisi sint. Culpa excepteur aute cillum minim magna fugiat culpa adipisicing eiusmod laborum ipsum fugiat quis. Mollit consectetur amet sunt ex amet tempor magna consequat dolore cillum adipisicing. Proident est sunt amet ipsum magna proident fugiat deserunt mollit officia magna ea pariatur. Ullamco proident in nostrud pariatur. Minim consequat pariatur id pariatur adipisicing.",
            category: "social deduction",
            created_at: expect.any(String),
            votes: 8,
          };
          const review = body.review;
          expect(review).toBeInstanceOf(Object);
          expect(review).toEqual(testReview);
        });
    });
    test("400: should return an error when id input is invalid", () => {
      return request(app)
        .get("/api/reviews/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("404: should return an error when review_id passed does not exist", () => {
      return request(app)
        .get("/api/reviews/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
  describe("PATCH", () => {
    test("200: should update review based on the object received as request body", () => {
      const votesObj = { inc_votes: 5 };
      return request(app)
        .patch("/api/reviews/6")
        .send(votesObj)
        .expect(200)
        .then(({ body }) => {
          const review = body.review;
          expect(review).toBeInstanceOf(Object);
          const testReview = {
            review_id: 6,
            title: "Occaecat consequat officia in quis commodo.",
            designer: "Ollie Tabooger",
            owner: "mallionaire",
            review_img_url:
              "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            review_body:
              "Fugiat fugiat enim officia laborum quis. Aliquip laboris non nulla nostrud magna exercitation in ullamco aute laborum cillum nisi sint. Culpa excepteur aute cillum minim magna fugiat culpa adipisicing eiusmod laborum ipsum fugiat quis. Mollit consectetur amet sunt ex amet tempor magna consequat dolore cillum adipisicing. Proident est sunt amet ipsum magna proident fugiat deserunt mollit officia magna ea pariatur. Ullamco proident in nostrud pariatur. Minim consequat pariatur id pariatur adipisicing.",
            category: "social deduction",
            created_at: expect.any(String),
            votes: 13,
          };
          expect(review).toEqual(testReview);
        });
    });
    test("404: should return an error when review_id passed does not exist", () => {
      const votesObj = { inc_votes: 5 };
      return request(app)
        .patch("/api/reviews/9999")
        .send(votesObj)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("400: should return an error when object value passed is not a number", () => {
      const votesObj = { inc_votes: "five" };
      return request(app)
        .patch("/api/reviews/6")
        .send(votesObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});
describe("/api/users", () => {
  describe("GET", () => {
    test("200: should return an array of objects, each object with properties username, name and avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toBeInstanceOf(Array);
          expect(body.users).not.toHaveLength(0);
          body.users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
  });
});
describe("/api/reviews", () => {
  describe("GET", () => {
    test("200: should return an array of objects, each with properties owner, title, review_id, category, review_img_url, created_at, votes, designer, comment_count. reviews should be sorted by date in desc order", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeInstanceOf(Array);
          expect(body.reviews).not.toHaveLength(0);
          expect(body.reviews).toBeSortedBy("created_at", { descending: true });
          body.reviews.forEach((review) => {
            expect(review).toHaveProperty("owner", expect.any(String));
            expect(review).toHaveProperty("title", expect.any(String));
            expect(review).toHaveProperty("review_id", expect.any(Number));
            expect(review).toHaveProperty("category", expect.any(String));
            expect(review).toHaveProperty("review_img_url", expect.any(String));
            expect(review).toHaveProperty("created_at", expect.any(String));
            expect(review).toHaveProperty("votes", expect.any(Number));
            expect(review).toHaveProperty("designer", expect.any(String));
            expect(review).toHaveProperty("comment_count", expect.any(Number));
          });
        });
    });
    test("400: should return an error when column to sort by is invalid", () => {
      return request(app)
        .get("/api/reviews?sort_by=banana&order=badorder")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("400: should return an error when order is invalid", () => {
      return request(app)
        .get("/api/reviews?order=badorder")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("200: should return an array of reviews filtered by category", () => {
      return request(app)
        .get("/api/reviews?category=dexterity")
        .expect(200)
        .then(({ body }) => {
          body.reviews.forEach((review) => {
            expect(review.category).toBe("dexterity");
          });
        });
    });
  });
});
