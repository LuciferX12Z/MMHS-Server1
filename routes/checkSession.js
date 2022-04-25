const { checkLoggedIn } = require("../middlewares/checkLoggedIn");

const router = require("express").Router();


router.get("/", checkLoggedIn, async (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});

module.exports = router;
