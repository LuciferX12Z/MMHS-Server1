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
describe("apply student test", () => {
  beforeAll(() => {});

  afterAll(() => {
    clearDB();
    app.removeAllListeners();
    // closeDB();
  });

  describe("post /apply", () => {
    it("save student pass", async () => {
      const res = await request(app).post("/apply").send({
        name: "zmhgay",
        phoneNumber: "12345678901",
        occupancy: "bitch",
        gender: "gay",
        age: 22,
        email: "mastergaylord69@gmail.com",
        company: "asdfgh",
        desiredCourse: "gayclass",
      });
      expect(res.statusCode).toBe(200);
    });
  });
});
