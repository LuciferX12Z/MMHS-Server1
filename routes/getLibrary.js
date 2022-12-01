const router = require("express").Router();
const { booksModel } = require("../database/Models");

router.get("/", async (req, res) => {
  try {
    const book = await booksModel.find({}).exec();
    res.json({ book });
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
