import { Schema, model } from "mongoose";

const branchMenuSchema = new Schema({
  menu: {
    type: Schema.Types.ObjectId,
    ref: "SidebarMenu",
    required: true,
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
});

export const BranchMenu = model("BranchMenu", branchMenuSchema);
