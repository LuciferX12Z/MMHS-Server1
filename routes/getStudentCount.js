const { studentsModel } = require("../database/Models");
const router = require("express").Router();

router.get("/getStudentCount/:courseID", async (req, res) => {
  try {
    const { courseID } = req.params;
    const studentCount = await studentsModel.countDocuments({
      desiredCourse: courseID,
    });
    res.json({ studentCount });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
