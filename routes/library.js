const router = require("express").Router();
const { verifyBookData } = require("../verifyData");
const { booksModel } = require("../database/Models");
const cloudinary = require("cloudinary").v2;
const { ObjectId } = require("mongodb");
const { checkLoggedIn } = require("../middlewares/checkLoggedIn");
const { uploadToCloudinary } = require("./courses");

router.post("/addBook", checkLoggedIn, async (req, res) => {
  const {
    bookImageUpload,
    book_name,
    author,
    category,
    details,
    publisher,
    publish_date,
  } = req.body;
  const bookData = await verifyBookData(
    book_name,
    author,
    category,
    details,
    publisher,
    publish_date
  ).then((value) => value);
  if (!bookData) {
    return res.status(400).json({ message: "Error:Wrong type of Data!" });
  }
  try {
    const bookCheck = await booksModel.findOne({ book_name: book_name }).exec();
    if (!bookCheck) {
      let image = [];
      image = await uploadToCloudinary(courseImageUpload);

      const books = new booksModel({
        bookImageUpload,
        book_name,
        author,
        category,
        details,
        publisher,
        publish_date,
      });
      await books.save();
      return res.json({ message: "Success:Book created successfully!" });
    }
    return res.status(400).json({ message: "Error:Book already exists!" });
  } catch (e) {
    console.log(e);
  }
});

// router.put("/editCourse/:id", checkLoggedIn, async (req, res) => {
//   const { id } = req.params;
//   const {
//     courseImageUpload,
//     courseName,
//     teacher,
//     studentLimit,
//     fee,
//     startingDate,
//     endingDate,
//     details,
//   } = req.body;
//   const classData = await verifyClassData(
//     courseName,
//     details,
//     endingDate,
//     fee,
//     startingDate,
//     studentLimit,
//     teacher
//   ).then((value) => value);
//   if (!classData) {
//     return res.status(400).json({ message: "Error:Wrong type of Data!" });
//   }

//   try {
//     const courseCheck = await classesModel
//       .findOne({ _id: ObjectId(id) })
//       .exec();
//     if (courseCheck) {
//       let image;
//       image = await uploadToCloudinary(courseImageUpload);
//       const classes = await classesModel.updateOne(
//         { _id: ObjectId(id) },
//         {
//           courseImageUpload: image,
//           courseName: courseName,
//           details: details,
//           endingDate: endingDate,
//           fee: fee,
//           startingDate: startingDate,
//           studentLimit: studentLimit,
//           teacher: teacher,
//         }
//       );
//       return res
//         .status(200)
//         .json({ message: "Success:Course updated successfully!" });
//     }
//     return res.status(400).json({ message: "Error:Course already exists!" });
//   } catch (e) {
//     console.log(e);
//   }
// });

// router.delete("/deleteCourse/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const classes = await classesModel.deleteOne({ _id: ObjectId(id) });
//     return res
//       .status(200)
//       .json({ message: "Success:Course deleted successfully!" });
//   } catch (e) {
//     console.log(e);
//   }
// });
// module.exports = router;
