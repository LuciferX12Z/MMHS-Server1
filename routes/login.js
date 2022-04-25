const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { adminsModel } = require("../database/Models");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    adminsModel.findOne({ email }, (err, user) => {
      if (err) {
        // console.error(err)
        console.log("HERE");
        res.status(500).json({
          error: "Internal Server Error !!",
        });
      } else if (!user) {
        res.status(401).json({
          error: "Invalid Credentials !!",
        });
      } else {
        bcrypt.compare(password.toString(), user.password, (err, isMatch) => {
          if (err) {
            console.error(err);

            res.status(500).json({
              error: "Internal Server Error !!",
            });
          } else if (!isMatch) {
            res.status(401).json({
              error: "Invalid Credentials !!",
            });
          } else {
            const token = jwt.sign(
              {
                email: user.email,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              }
            );
            res
              .cookie("token", token, {
                domain: "localhost",
                path: "/",
                httpOnly: true,
              })
              .status(200)
              .json({
                message: "ok",
              });
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

// const router = require("express").Router();
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const { adminsModel } = require("../database/Models");
// router.post(
//   "/",
//   passport.authenticate("local", {
//     successMessage: "Successfully logged in",
//     failureMessage: "Invalid email or password",
//   }),
//   async (req, res) => {
//     res.setHeader("WWW-Authenticate", "Basic");
//     console.log(req.body);
//     res.status(200).json({
//       message: "Successfully logged in",
//     });
//   }
// );

// module.exports = router;
