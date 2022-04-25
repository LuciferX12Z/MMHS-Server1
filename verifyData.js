const Joi = require("joi");

const classesSchema = Joi.object({
  courseName: Joi.string().min(5).max(30).required(),
  teacher: Joi.string().min(5).max(30).required(),
  startingDate: Joi.string().required(),
  endingDate: Joi.string().required(),
  studentLimit: Joi.number().min(1).required(),
  fee: Joi.number().min(1).required(),
  details: Joi.string().required(),
});

const studentSchema = Joi.object({
  name: Joi.string().min(5).max(30).required(),
  age: Joi.number().min(1).max(80).required(),
  gender: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(11).max(11).required(),
  company: Joi.string().required(),
  desiredCourse: Joi.string().required(),
});

const adminSchema = Joi.object({
  name: Joi.string().min(5).max(30).required(),
  role: Joi.string().required(),
  gender: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(11).max(11).required(),
  password: Joi.string().required(),
});

const verifyStudentData = async (
  name,
  age,
  gender,
  email,
  phone,
  company,
  desiredCourse
) => {
  try {
    const { error } = await studentSchema.validateAsync({
      name,
      age,
      gender,
      email,
      phone,
      company,
      desiredCourse,
    });

    if (typeof error === "undefined") {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e.details[0].message);
  }
};

const verifyClassData = async (
  courseName,
  details,
  endingDate,
  fee,
  startingDate,
  studentLimit,
  teacher
) => {
  try {
    const { error } = await classesSchema.validateAsync({
  courseName,
  details,
  endingDate,
  fee,
  startingDate,
  studentLimit,
  teacher
    });

    if (typeof error === "undefined") {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e.details[0].message);
  }
};

const verifyAdminData = async (
  name,
  role,
  gender,
  email,
  phoneNumber,
  password
) => {
  try {
    const { error } = adminSchema.validate({
      name,
      role,
      gender,
      email,
      phoneNumber,
      password
    }) 

    if (typeof error === "undefined") {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = { verifyStudentData , verifyAdminData , verifyClassData };
