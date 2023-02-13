require("dotenv").config();
const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const AdminJSMongoose = require("@adminjs/mongoose");
const passwordsFeature = require("@adminjs/passwords");
const expressSession = require("express-session");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");
const { Admin } = require("mongodb");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const PORT = process.env.PORT || 5000;
const app = express();
const { adminsModel, studentsModel } = require("./database/Models");

let sessionConfigObject = {
  secret: process.env.COOKIE_SECRET_2,
  saveUninitialized: true,
  cookie: {},
};

const CORS_FRONT_END_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_FRONTEND_URL
    : process.env.DEVELOPMENT_FRONTEND_URL;

app.use(expressSession(sessionConfigObject));
// const mongooseDB = mongoose.connect(
//   "mongodb+srv://admin:12345@cluster0.e5xf8sq.mongodb.net/?retryWrites=true&w=majority"
// );
const mongooseDB = mongoose.connect(process.env.DB_CONNECT_URL);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  sessionConfigObject.cookie.secure = true;
}

const start = () => {
  AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
  });

  const AdminResourceOptions = {
    databases: [mongooseDB],
    resource: adminsModel,
    options: {
      properties: { password: { isVisible: false }, _id: { isVisible: false } },
      actions: {
        edit: {
          isAccessible: false,
          isVisible: false,
        },
      },
    },
    features: [
      passwordsFeature({
        properties: {
          encryptedPassword: "password",
          password: "newPassword",
        },
        hash: bcrypt.hash,
      }),
    ],
  };

  const StudentResourceOptions = {
    databases: [mongooseDB],
    resource: studentsModel,
    options: {
      properties: { _id: { isVisible: false } },
    },
  };

  const adminOptions = {
    rootPath: "/admin",
    resources: [AdminResourceOptions, StudentResourceOptions],
  };

  const admin = new AdminJS(adminOptions);

  // const DEFAULT_ADMIN = {
  //   email: "developer@admin.com",
  //   password: "administrator",
  // };

  // handle authentication
  // const authenticate = async (email, password) => {
  //   //condition to check for correct login details
  //   if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
  //     //if the condition is true
  //     return Promise.resolve(DEFAULT_ADMIN);
  //   }
  //   //if the condition is false
  //   return null;
  // };

  const authenticate = async (email, password) => {
    // console.log({ email, password });
    try {
      const user = await adminsModel.findOne({ email });
      // console.log(user);
      if (user) {
        const isMatch = await bcrypt.compare(
          password.toString(),
          user.password
        );
        // console.log(isMatch);
        if (isMatch) {
          return user;
        } else {
          return false;
        }
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  };

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: "AdminJS",
      cookiePassword: "Secret",
    },
    null,
    {
      // store: expressSession,
      // resave: true,
      // saveUninitialized: true,
      // secret: "Secret",
      name: "adminjs",
      ...sessionConfigObject,
    }
  );
  app.use(admin.options.rootPath, adminRouter);

  // app.use(
  //   session({
  //     name: "session-id",
  //     secret: config.SESSION_SECRET,
  //     // expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  //     keys: [config.COOKIE_SECRET_KEY_1, config.COOKIE_SECRET_KEY_2],
  //   })
  // );
};

const config = {
  SESSION_SECRET: process.env.SESSION_SECRET,
  COOKIE_SECRET_KEY_1: process.env.COOKIE_SECRET_1,
  COOKIE_SECRET_KEY_2: process.env.COOKIE_SECRET_2,
};

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", CORS_FRONT_END_URL);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  cors({
    origin: CORS_FRONT_END_URL,
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use("/register", require("./routes/register"));
app.use("/", require("./routes/courses"));
app.use("/apply", require("./routes/applyStudent"));
app.use("/checkSession", require("./routes/checkSession"));
app.use("/getcourse", require("./routes/getCourses"));
app.use("/getlibrary", require("./routes/getLibrary"));
app.use("/library", require("./routes/library"));
app.use("/getStudentCount", require("./routes/getStudentCount"));
app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = {
  app,
  CORS_FRONT_END_URL,
  start,
};
