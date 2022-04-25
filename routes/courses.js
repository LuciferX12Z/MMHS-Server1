const router = require("express").Router();
const { verifyClassData } = require("../verifyData");
const { classesModel } = require("../database/Models");
const cloudinary = require("cloudinary").v2;
const { ObjectId } = require("mongodb");
const { checkLoggedIn } = require("../middlewares/checkLoggedIn");

async function uploadToCloudinary(courseImageUpload) {
  const imagesToBeUploaded = courseImageUpload?.fileList?.filter(
    (image) => image?.name
  );
  let imagesToNotBeUploaded = [];
  for (i = 0; i < courseImageUpload?.fileList?.length; i++) {
    if (courseImageUpload?.fileList[i]?.url) {
      imagesToNotBeUploaded.push({
        url: courseImageUpload?.fileList[i]?.url,
        public_id: courseImageUpload?.fileList[i]?.public_id,
      });
    }
  }

  let images = [];
  for (let i = 0; i < imagesToBeUploaded?.length; i++) {
    const img = await cloudinary.uploader
      .upload(imagesToBeUploaded[i]?.image?.image, (error, result) => {
        return result.secure_url;
      })
      .then((value) =>
        images.push({
          url: value.secure_url,
          public_id: value.public_id,
        })
      );
    // .then((value) => images.push(value.secure_url));
  }
  return [...images, ...imagesToNotBeUploaded];
}

router.post("/addCourse", checkLoggedIn, async (req, res) => {
  const {
    courseImageUpload,
    courseName,
    details,
    endingDate,
    fee,
    startingDate,
    studentLimit,
    teacher,
  } = req.body;
  const classData = await verifyClassData(
    courseName,
    details,
    endingDate,
    fee,
    startingDate,
    studentLimit,
    teacher
  ).then((value) => value);
  if (!classData) {
    return res.status(400).json({ message: "Error:Wrong type of Data!" });
  }
  try {
    const courseCheck = await classesModel
      .findOne({ courseName: courseName })
      .exec();
    if (!courseCheck) {
      let image = [];
      image = await uploadToCloudinary(courseImageUpload);

      const classes = new classesModel({
        courseImageUpload: image,
        courseName: courseName,
        details: details,
        endingDate: endingDate,
        fee: fee,
        startingDate: startingDate,
        studentLimit: studentLimit,
        teacher: teacher,
      });
      await classes.save();
      return res.json({ message: "Success:Course created successfully!" });
    }
    return res.status(400).json({ message: "Error:Course already exists!" });
  } catch (e) {
    console.log(e);
  }
});

router.put("/editCourse/:id", checkLoggedIn, async (req, res) => {
  const { id } = req.params;
  const {
    courseImageUpload,
    courseName,
    teacher,
    studentLimit,
    fee,
    startingDate,
    endingDate,
    details,
  } = req.body;
  const classData = await verifyClassData(
    courseName,
    details,
    endingDate,
    fee,
    startingDate,
    studentLimit,
    teacher
  ).then((value) => value);
  if (!classData) {
    return res.status(400).json({ message: "Error:Wrong type of Data!" });
  }

  try {
    const courseCheck = await classesModel
      .findOne({ _id: ObjectId(id) })
      .exec();
    if (courseCheck) {
      let image;
      image = await uploadToCloudinary(courseImageUpload);
      const classes = await classesModel.updateOne(
        { _id: ObjectId(id) },
        {
          courseImageUpload: image,
          courseName: courseName,
          details: details,
          endingDate: endingDate,
          fee: fee,
          startingDate: startingDate,
          studentLimit: studentLimit,
          teacher: teacher,
        }
      );
      return res
        .status(200)
        .json({ message: "Success:Course updated successfully!" });
    }
    return res.status(400).json({ message: "Error:Course already exists!" });
  } catch (e) {
    console.log(e);
  }
});

router.delete("/deleteCourse/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const classes = await classesModel.deleteOne({ _id: ObjectId(id) });
    return res
      .status(200)
      .json({ message: "Success:Course deleted successfully!" });
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
