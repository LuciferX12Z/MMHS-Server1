require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports = {
  checkLoggedIn: (req, res, next) => {
    const token = req.cookies.token;
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
            path: "/",
            httpOnly: true,
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
