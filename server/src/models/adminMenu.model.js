import { Schema, model } from "mongoose";

const adminMenuSchema = new Schema({
  menu: {
    type: Schema.Types.ObjectId,
    ref: "SidebarMenu",
    required: true,
  },
});

export const AdminMenu = model("AdminMenu", adminMenuSchema);
