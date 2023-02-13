require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../app");
const { adminsModel } = require("../../database/Models");

// adminsModel.find = jest.fn().mockReturnValueOnce({
//   email: "zmhgaylord69@gmail.com",
// });

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
describe("register test", () => {
  beforeAll(() => {});

  afterAll(() => {
    clearDB();
    app.removeAllListeners();
    // closeDB();
  });

  describe("post /login & /logout", () => {
    it("save admin pass", async () => {
      const res = await request(app).post("/register").send({
        name: "zmhgay",
        role: "bitch",
        gender: "gay",
        email: "mastergaylord69@gmail.com",
        phoneNumber: "12345678901",
        password: "asdfgh",
      });
      expect(res.statusCode).toBe(200);
    });
    it("login", async () => {
      const res = await request(app).post("/login").send({
        email: "mastergaylord69@gmail.com",
        password: "asdfgh",
      });
      expect(res.statusCode).toBe(200);
    });
    it("logout", async () => {
      const res = await request(app).post("/logout");
      expect(res.statusCode).toBe(200);
    });
  });
});
