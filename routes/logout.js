const router = require("express").Router();
router.post("/", (req, res) => {
  console.log(req.cookies.token);
  res
    .clearCookie("token", { path: "/" })
    .status(200)
    .json({
      message: "ok",
    })
    .end();
});

module.exports = router;
