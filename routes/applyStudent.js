const router = require("express").Router();
const { verifyStudentData } = require("../verifyData");
const { studentsModel } = require("../database/Models");

router.post("/", async (req, res) => {
    const {
      name,
      phoneNumber,
      occupancy,
      gender,
      age,
      email,
      company,
      desiredCourse,
    } = req.body;
    const validStudent = await verifyStudentData(
      name,
      age,
      gender,
      email,
      phoneNumber,
      company,
      desiredCourse
    ).then((value) => value);
    if (!validStudent) {
      return res.status(400).send("BOO do some shit");
    }
  
    try {
      const student = new studentsModel({
        name,
        phone: phoneNumber,
        occupancy,
        gender,
        age,
        email,
        company,
        desiredCourse,
      });
      const a = await student.save();
      res.send(a);
    } catch (e) {
      console.log(e);
    }
  });
module.exports = router;
