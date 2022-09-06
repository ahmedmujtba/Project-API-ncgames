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
