const router = require("express").Router();
const { verifyBookData } = require("../verifyData");
const { booksModel } = require("../database/Models");
const { ObjectId } = require("mongodb");
const { checkLoggedIn } = require("../middlewares/checkLoggedIn");
const uploadToCloudinary = require("../helpers/uploadImageToCloudinary");

router.post("/addBook", checkLoggedIn, async (req, res) => {
  const {
    bookImageUpload,
    book_name,
    author,
    category,
    details,
    publisher,
    publish_date,
    bookUrl,
  } = req.body;
  const bookData = await verifyBookData(
    book_name,
    author,
    category,
    details,
    publisher,
    publish_date,
    bookUrl
  ).then((value) => value);
  if (!bookData) {
    return res.status(400).json({ message: "Error:Wrong type of Data!" });
  }
  try {
    const bookCheck = await booksModel.findOne({ book_name: book_name }).exec();
    if (!bookCheck) {
      let image = [];
      image = await uploadToCloudinary(bookImageUpload);
      const books = new booksModel({
        bookImageUpload: image,
        book_name,
        author,
        category,
        details,
        publisher,
        publish_date,
        bookUrl,
      });
      await books.save();
      return res.json({ message: "Success:Book created successfully!" });
    }
    return res.status(400).json({ message: "Error:Book already exists!" });
  } catch (e) {
    console.log(e);
  }
});

router.put("/editBook/:id", checkLoggedIn, async (req, res) => {
  const { id } = req.params;
  const {
    bookImageUpload,
    book_name,
    author,
    category,
    details,
    publisher,
    publish_date,
    bookUrl,
  } = req.body;
  const bookData = await verifyBookData(
    book_name,
    author,
    category,
    details,
    publisher,
    publish_date,
    bookUrl
  ).then((value) => value);
  if (!bookData) {
    return res.status(400).json({ message: "Error:Wrong type of Data!" });
  }

  try {
    const bookCheck = await booksModel.findOne({ _id: ObjectId(id) }).exec();
    if (bookCheck) {
      let image;
      image = await uploadToCloudinary(bookImageUpload);
      const book = await booksModel.updateOne(
        { _id: ObjectId(id) },
        {
          bookImageUpload,
          book_name,
          author,
          category,
          details,
          publisher,
          publish_date,
          bookUrl,
        }
      );
      return res
        .status(200)
        .json({ message: "Success:Course updated successfully!" });
    }
    return res.status(400).json({ message: "Error:Book does not exist!" });
  } catch (e) {
    console.log(e);
  }
});

router.delete("/deleteBook/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const bookCheck = await booksModel.findOne({ _id: ObjectId(id) }).exec();
    if (bookCheck) {
      const book = await booksModel.deleteOne({ _id: ObjectId(id) });
      return res
        .status(200)
        .json({ message: "Success:Course deleted successfully!" });
    }
    return res.status(400).json({ message: "Error:Book does not exist!" });
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
