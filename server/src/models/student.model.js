// // import { Schema, model } from "mongoose";

// // const studentSchema = new Schema(
// //   {
// //     name: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     dateOfBirth: {
// //       type: Date,
// //       required: true,
// //     },
// //     fathersName: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     mothersName: {
// //       type: String,
// //       trim: true,
// //     },
// //     guardiansName: {
// //       type: String,
// //       trim: true,
// //     },
// //     maritalStatus: {
// //       enum: ["married", "unmarried"],
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     createdBy: {
// //       type: Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //     },
// //     courseName: {
// //       type: Schema.Types.ObjectId,
// //       ref: "Course",
// //       required: true,
// //     },
// //     registrationNo: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //       unique: true,
// //     },
// //     registrationYear: {
// //       type: String,
// //       required: true,
// //     },
// //     addmissionDate: {
// //       type: Date,
// //       required: true,
// //     },
// //     email: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //       trim: true,
// //     },
// //     phone: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     address: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     city: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     state: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     pin: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     adhaarNo: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     photo: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     signature: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     documents: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     isCompleted: {
// //       type: Boolean,
// //       default: false,
// //     },
// //     isActive: {
// //       type: Boolean,
// //       default: true,
// //     },
// //     isRegistered: {
// //       type: Boolean,
// //       default: false,
// //     },
// //     year: {
// //       type: String,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // export const Student = model("Student", studentSchema);

// // models/student.model.ts
// import mongoose from "mongoose";

// const studentSchema = new mongoose.Schema(
//   {
//     formType: {
//       type: String,
//       default: "student",
//     },
//     data: {
//       type: Map,
//       of: mongoose.Schema.Types.Mixed,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// export const Student = mongoose.model("Student", studentSchema);

import mongoose from "mongoose";

// For each field's data (key-value pair)
const formFieldDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // must match one of the field names from config
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // can be string, number, boolean, etc.
    required: true,
  },
}, { _id: false });

// Main form data schema
const dynamicFormDataSchema = new mongoose.Schema({
  formType: {
    type: String,
    required: true, // e.g., "student", "course", "branch", "exam"
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DynamicForm", // optional, if you want to link to the form structure
  },
  fieldsData: {
    type: [formFieldDataSchema],
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("DynamicFormData", dynamicFormDataSchema);

// Example of storing data in DB
// {
//   "formType": "student",
//   "formId": "66d2aeb31234abcd56789ef0", // optional reference
//   "fieldsData": [
//     { "name": "Name", "value": "Rahul Sharma" },
//     { "name": "Email", "value": "rahul@example.com" },
//     { "name": "Course", "value": "BCA" },
//     { "name": "dob", "value": "2002-05-17" }
//   ]
// }