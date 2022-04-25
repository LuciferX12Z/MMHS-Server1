const router = require("express").Router();
const { verifyAdminData } = require("../verifyData");
const { adminsModel } = require("../database/Models");
const bcrypt = require("bcryptjs");
const { checkLoggedIn } = require("../middlewares/checkLoggedIn");

router.post("/register", checkLoggedIn, async (req, res) => {
  const { name, role, gender, email, phoneNumber, password, confirmPassword } =
    req.body;
  const adminData = await verifyAdminData(
    name,
    role,
    gender,
    email,
    phoneNumber,
    password
  ).then((value) => value);
  if (!adminData) {
    return res.json({ message: "Error:Wrong type of Data!" });
  }
  try {
    const emailCheck = await adminsModel.find({ email: email }).exec();
    if (emailCheck.length == 0) {
      const salt = bcrypt.genSaltSync(parseInt(process.env.PASSWORD));
      const hash = bcrypt.hashSync(password, salt);
      const admin = new adminsModel({
        username: name,
        role: role,
        gender: gender,
        email: email,
        phone: phoneNumber,
        password: hash,
      });
      console.log("haha");
      await admin.save();
      return res.json({ message: "Success:Admin created successfully!" });
    }
    return res.json({ message: "Error:Email already existed!" });
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
