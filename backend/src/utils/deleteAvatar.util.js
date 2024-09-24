import fs from "fs";
import { ApiError } from "./ApiError.util.js";
export const deleteAvatar = async (avatarLocalPath) => {
  try {
    await fs.unlink(avatarLocalPath)
  } catch (error) {
    throw new ApiError(500, `Something went wrong while deleting avatar: ${error.message}`); 
  }
}