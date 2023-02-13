require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../app");

async function clearDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}
async function closeDB() {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}

let id = "";

describe("course test", () => {
  beforeAll(() => {});

  afterAll(() => {
    // clearDB();
    app.removeAllListeners();
    // closeDB();
  });

  describe("post edit, add, get and delete book", () => {
    it("add book", async () => {
      const res = await request(app).post("/library/addBook").send({
        bookImageUpload: "",
        book_name: "zmhgaylord",
        author: "zmhgay",
        category: "gaybook",
        details: "gaylord",
        publisher: "69gaymen",
        publish_date: "6.9.2020",
        bookUrl: "pornhub.com",
      });
      expect(res.statusCode).toBe(200);
    });
    it("get book", async () => {
      const res = await request(app).get("/getLibrary");
      id = res.body.book[0]._id;
      expect(res.statusCode).toBe(200);
    });

    it("edit book", async () => {
      const res = await request(app).put(`/library/editBook/${id}`).send({
        bookImageUpload: "",
        book_name: "zmhgaylord",
        author: "zmhgay",
        category: "gaybook69",
        details: "gaylord",
        publisher: "69gaymen",
        publish_date: "6.9.2020",
        bookUrl: "",
      });
      expect(res.statusCode).toBe(200);
    });
    it("delete book", async () => {
      const res = await request(app)
        .delete(`/library/deleteBook/${id}`)
        .send({});
      expect(res.statusCode).toBe(200);
    });
  });
});
