require("dotenv").config();
const express = require("express");
const cors = require("cors");
const moongoose = require("mongoose");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");
const cloudinary = require("cloudinary").v2;
const PORT = process.env.PORT || 5000;
const app = express();

const config = {
  SESSION_SECRET: process.env.SESSION_SECRET,
  COOKIE_SECRET_KEY_1: process.env.COOKIE_SECRET_1,
  COOKIE_SECRET_KEY_2: process.env.COOKIE_SECRET_2,
};

app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://mmhs-client1.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );
app.use(helmet());
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// app.use(
//   session({
//     name: "session-id",
//     secret: config.SESSION_SECRET,
//     // expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
//     keys: [config.COOKIE_SECRET_KEY_1, config.COOKIE_SECRET_KEY_2],
//   })
// );

app.use("/", require("./routes/register"));
app.use("/", require("./routes/courses"));
app.use("/apply", require("./routes/applyStudent"));
app.use("/checkSession", require("./routes/checkSession"));
app.use("/getcourse", require("./routes/getCourses"));
app.use("/", require("./routes/getStudentCount"));
app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));

moongoose.connect(process.env.DB_CONNECT_URL);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("SHIT");
});
