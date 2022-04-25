const mongoose = require("mongoose");

const adminsSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number },
  role: String,
});

// const booksSchema = new mongoose.Schema({
//     book_name : {type:String, required:true},
//     author : {type:String, required:true},
//     author_pic : String,
//     category : {type:String, required:true},
//     details : String,
//     publisher : String,
//     publish_date : Date
// })

const classesSchema = new mongoose.Schema({
  courseImageUpload: [
    {
      url: String,
      public_id: String,
    },
  ],
  courseName: { type: String, required: true },
  teacher: { type: String, required: true },
  startingDate: { type: Date, required: true },
  endingDate: { type: Date, required: true },
  studentLimit: { type: Number, required: true },
  fee: { type: String, required: true },
  details: String,
});

// const eventsSchema = new mongoose.Schema({
//     event_name : {type:String, required:true},
//     event_place : {type:String, required:true},
//     event_date : {type:Date, required:true},
//     organizer : {type:String, required:true},
//     details : String
// })

const studentsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  occupation: { type: String },
  company: {
    type: String,
    required: true,
  },
  desiredCourse: {
    type: String,
    required: true,
  },
});
// class_id: { type: String, required: true },

const adminsModel = mongoose.model("admin", adminsSchema);
// const booksModel = new mongoose.model("book", booksSchema)
const classesModel = mongoose.model("class", classesSchema);
// const eventsModel = new mongoose.model("event", eventsSchema)
const studentsModel = mongoose.model("student", studentsSchema);
module.exports = { adminsModel, studentsModel, classesModel };
