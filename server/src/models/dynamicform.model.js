import mongoose from "mongoose";

const selectOptionSchema = new mongoose.Schema({
  value :{
    type:String,
    required: true
  }
} ,{_id: false});

const singleFieldSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  label: {
     type: String, 
     required: true 
    },
  placeholder: { 
    type: String, 
    required: true 
  },
  type: {
    type: String,
    enum: ["text", "number", "email", "date", "tel", "file", "select", "textarea", "checkbox", "radio"],
    required: true,
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  order: { 
    type: Number, 
    required: true 
  },
  isSearchable:{
    type:Boolean,
    default: false
  },
  options: { 
    type: [selectOptionSchema], 
    default: [] },
}, { _id: false });

const dynamicFormSchema = new mongoose.Schema({
 
 
  formType: {
    type: String,
    required: true,
  },
  fields: {
    type: [singleFieldSchema],
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("DynamicForm", dynamicFormSchema);