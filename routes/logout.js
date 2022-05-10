const router = require("express").Router();
router.post("/", (req, res) => {
  console.log(req.cookies.token);
  res
    .clearCookie("token", {
      domain: "https://mmhs-client1.vercel.app",
      path: "/",
    })
    .status(200)
    .json({
      message: "ok",
      token: req.cookies.token,
    })
    .end();
});

module.exports = router;
