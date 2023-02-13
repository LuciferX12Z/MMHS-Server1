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

  describe("post edit, add, get and delete course", () => {
    it("add course", async () => {
      const res = await request(app).post("/addCourse").send({
        courseImageUpload: "",
        courseName: "zmhgaylord",
        details: "lorem10",
        endingDate: "6.9.2023",
        fee: 4200,
        startingDate: "4.4.2023",
        studentLimit: 69,
        teacher: "tengaymen",
      });
      expect(res.statusCode).toBe(200);
    });
    it("get course", async () => {
      const res = await request(app).get("/getCourse");
      id = res.body.course[0]._id;
      expect(res.statusCode).toBe(200);
    });

    it("edit course", async () => {
      const res = await request(app).put(`/editCourse/${id}`).send({
        courseImageUpload: "",
        courseName: "zmhgaylord69",
        details: "lorem69",
        endingDate: "6.9.2023",
        fee: 4200,
        startingDate: "4.4.2023",
        studentLimit: 69,
        teacher: "69gaymen",
      });
      expect(res.statusCode).toBe(200);
    });
    it("delete course", async () => {
      const res = await request(app).delete(`/deleteCourse/${id}`).send({});
      expect(res.statusCode).toBe(200);
    });
  });
});
