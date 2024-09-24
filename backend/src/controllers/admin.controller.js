import { Auth } from "../models/login.model.js";
import { Employee } from "../models/employee.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asnycHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { deleteAvatar } from "../utils/deleteAvatar.util.js";
import { generateAccessAndRefreshTokens } from "../utils/generateTokens.utils.js";
import { options } from "../utils/constants.utils.js";
import fs from "fs";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.util.js";
import { log } from "console";

const registerEmployee = asyncHandler(async (req, res) => {
  const { name, email, designation, course, gender, mobile } = req.body;
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(404, "Avatar is missing.");
  }

  if (
    [name, email, designation, gender].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required and must not be empty");
  }

  const existedEmployee = await Employee.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existedEmployee) {
    throw new ApiError(400, "Employee with email or mobile already exists.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath, "task_avatar");
  if (!avatar?.url) {
    throw new ApiError(400, "Something went wrong while uploading avatar.");
  }

  const employee = await Employee.create({
    name,
    email,
    designation,
    course,
    gender,
    mobile,
    avatar: avatar.url,
  });

  if (!employee) {
    throw new ApiError(500, "Something went wrong while creating employee.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, employee, "Employee created successfully."));
});

const updateEmployee = asyncHandler(async (req, res) => {
  const { name, email, designation, course, gender, mobile } = req.body;
  const { employeeId } = req.params;
  const avatar = req.file?.path;
  const prevEmployee = await Employee.findById(employeeId);

  const oldAvatarLocalPath = prevEmployee.avatar;
  let newAvatar;
  
  if (avatar) {
    newAvatar = await uploadOnCloudinary(avatar, "task_avatar");
  }
  
  if (newAvatar?.url) {
    throw new ApiError(400, "Something went wrong while uploading avatar.");
  }

  let employee;
  try {
    // Prepare the update object
    const updateData = {
      name,
      email,
      designation,
      course,
      gender,
      mobile,
    };

    // Only add avatar to the updateData object if it exists
    if (avatar) {
      updateData.avatar = newAvatar.url;
    }

    employee = await Employee.findByIdAndUpdate(
      prevEmployee._id,
      {
        $set: updateData,
      },
      {
        new: true,
      }
    );
  } catch (error) {
    throw new ApiError(500, "Something went wrong while updating employee.");
  }

  // Delete the old avatar if a new one was uploaded
  if (avatar) {
    await deleteFromCloudinary(oldAvatarLocalPath, "task_avatar");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, employee, "Employee updated successfully."));
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  let employee = await Employee.findById(employeeId);
  const avatarLocalPath = employee?.avatar;

  if (!employeeId) {
    throw new ApiError(404, "Employee ID is required.");
  }

  try {
    employee = await Employee.findByIdAndDelete(employeeId);
    await deleteFromCloudinary(avatarLocalPath);
  } catch (error) {
    throw new ApiError(500, "Something went wrong while deleting employee.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Employee deleted successfully."));
});

const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find();

  if (!employees.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, employees, "No employee found ."));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, employees, "Employees list retrived successfully.")
    );
});

const getEmplyeeById = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  if (!employeeId) {
    throw new ApiError(404, "Employee Id is required.");
  }
  const employee = await Employee.findById(employeeId);

  if (!employee) {
    throw new ApiError(404, "Employee Not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, employee, "Employee details retrived successfully. ")
    );
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { username, password, name } = req.body;

  if ([username, password, name].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedAdmin = await Auth.findOne({
    username,
  });
  if (existedAdmin) {
    throw new ApiError(400, "Admin already exists with this username.");
  }

  const admin = await Auth.create({
    username,
    password,
    name,
  });

  if (!admin) {
    throw new ApiError(500, "Failed to create admin.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, admin, "Admin created successfully."));
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "All fields are required.");
  }

  const user = await Auth.findOne({ username });

  if (!user) {
    throw new ApiError(401, "Invalid username");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await Auth.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken, refreshToken },
        "Admin logged in successfully."
      )
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  try {
    await Auth.findByIdAndUpdate(req.user?._id, {
      $unset: { refreshToken: 1 },
    });
  } catch (error) {
    throw new ApiError(500, "Something went wrong while logging out user.");
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "Admin logged out successfully."));
});

export {
  registerEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
  getEmplyeeById,
  registerAdmin,
  loginAdmin,
  logoutAdmin,
};
