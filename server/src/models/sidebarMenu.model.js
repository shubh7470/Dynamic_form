import { Schema, model } from "mongoose";

const sidebarMenuSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true,
    trim: true,
  },
  subMenu: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      link: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  link: {
    type: String,
    required: true,
    trim: true,
  },
});
export const SidebarMenu = model("SidebarMenu", sidebarMenuSchema);
