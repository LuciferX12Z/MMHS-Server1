const router = require("express").Router();
const isProdMode = process.env.NODE_ENV === "production";

const CORS_FRONT_END_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_FRONTEND_URL
    : process.env.DEVELOPMENT_FRONTEND_URL;
router.post("/", (req, res) => {
  console.log(req.cookies.token);
  res
    .clearCookie("token", {
      domain: CORS_FRONT_END_URL,
      path: "/",
      httpOnly: isProdMode ? true : false,
      sameSite: isProdMode ? "None" : "lax",
      secure: isProdMode ? true : false,
    })
    .status(200)
    .json({
      message: "ok",
    })
    .end();
});

module.exports = router;
