import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.util.js";

export const connectDB = async ()=> {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGOOSE_URI}`)
    console.log(
      `MongoDB connected successfully! DB Host :${connectionInstance.connection.host} `
    );
  } catch (error) {
    throw new ApiError(500, "MongoDB connection failed !!", error)
  }
}