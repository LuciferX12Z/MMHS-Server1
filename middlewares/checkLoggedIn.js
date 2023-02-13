require("dotenv").config();
const jwt = require("jsonwebtoken");
const isProdMode = process.env.NODE_ENV === "production";
const CORS_FRONT_END_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_FRONTEND_URL
    : process.env.DEVELOPMENT_FRONTEND_URL;

module.exports = {
  checkLoggedIn: (req, res, next) => {
    const token = req?.cookies?.token?.split("=")[1]
      ? req?.cookies?.token?.split("=")[1]
      : req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "You are not logged in",
      });
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: "You are not logged in",
          });
        } else {
          const refreshedToken = generateRefreshToken(decoded.email);
          req.email = decoded.email;
          res.cookie("token", refreshedToken, {
            domain: CORS_FRONT_END_URL,
            path: "/",
            httpOnly: isProdMode ? true : false,
            sameSite: isProdMode ? "None" : "lax",
            secure: isProdMode ? true : false,
          });
          next();
        }
      });
    }
  },
};

function generateRefreshToken(email) {
  return jwt.sign(
    {
      email: email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
}
