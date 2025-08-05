import { asyncHandler } from "../utils/asyncHandler.js";
import { Branch } from "../models/branch.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiArror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import bcrypt from "bcrypt";
const registerBranch = asyncHandler(async (req, res) => {
  const {
    name,
    password,
    branchName,
    email,
    code,
    address,
    phone,
    directorname,
    directoradress,
    location,
    dist,
    state,
    religion,
    coursefees,
  } = req.body;
  const { signature, image } = req.files;
  if (
    [
      name,
      password,
      branchName,
      email,
      address,
      phone,
      code,
      directorname,
      directoradress,
      location,
      dist,
      state,
      religion,
    ].some((field) => field?.trim() === "") ||
    !signature ||
    !image
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // console.log(coursefees);
  let coursefees2 = [];
  if (coursefees) {
    coursefees2 = JSON.parse(coursefees).map((item) => ({
      duration: item.duration,
      fees: Number(item.fees),
    }));
  } else {
    throw new ApiError(400, "Course is required");
  }
  const existedUser = await User.findOne({ email });
  // console.log(existedUser);
  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }
  const directorsignature = `${req.protocol}://${req.get("host")}/assets/${
    signature[0].filename
  }`;
  const avatar = `${req.protocol}://${req.get("host")}/assets/${
    image[0].filename
  }`;

  const user = await User.create({
    name,
    email,
    password,
    role: "branch",
    avatar,
  });
  const branch = await Branch.create({
    user: user._id,
    branchName,
    address,
    phone,
    code,
    directorname,
    directoradress,
    directorsignature,
    location,
    dist,
    state,
    religion,
    isActive: true,
    coursefees: coursefees2,
  });
  if (!user || !branch) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  const createdBranch = await Branch.findById(branch._id).populate(
    "user",
    "-password -refreshToken"
  );

  res
    .status(200)
    .json(new ApiResponse(200, createdBranch, "Branch created successfully"));
});
//get all branches with rearch and sort
const getAllBranches = asyncHandler(async (req, res) => {
  const { search = "", sortBy = "createdAt", order = "asc" } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortOrder = order === "desc" ? -1 : 1;

  const searchQuery = search
    ? {
        $or: [
          { branchName: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { directorname: { $regex: search, $options: "i" } },
        ],
      }
    : {};
  const branches = await Branch.find(searchQuery)
    .populate("user", "-password -refreshToken")
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);
  const count = branches.length;
  const totalBranches = await Branch.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalBranches / limit);
  const pagination = {
    totalBranches,
    totalPages,
    currentPage: page,
    limit,
    count,
  };

  if (!branches) {
    throw new ApiError(500, "Something went wrong while fetching branches");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        branches,
        pagination,
      },
      "Branches fetched successfully"
    )
  );
});

//get all
const getAllbranchesName = asyncHandler(async (_, res) => {
  const branches = await Branch.find().select("branchName _id");
  const data = branches.map((branch) => ({
    value: branch._id.toString(),
    label: branch.branchName || "",
  }));
  res.status(200).json(new ApiResponse(200, data, "success"));
});

const getBranchById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const branch = await Branch.findById(id).populate(
    "user",
    "-password -refreshToken"
  );
  if (!branch) {
    throw new ApiError(404, "Branch not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, branch, "Branch fetched successfully"));
});

export { registerBranch, getAllBranches, getBranchById, getAllbranchesName };
