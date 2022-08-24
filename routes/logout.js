const router = require("express").Router();
router.post("/", (req, res) => {
  console.log(req.cookies.token);
  res
    .clearCookie("token", {
      domain: "https://mmhs-client1.vercel.app",
      path: "/",
      httpOnly: true,
      sameSite: "None",
      secure: true,
    })
    .status(200)
    .json({
      message: "ok",
      token: req.cookies.token,
    })
    .end();
});

module.exports = router;
