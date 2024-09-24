import {asyncHandler} from "../utils/asnycHandler.util.js";
import {ApiError} from "../utils/ApiError.util.js";
import jwt from "jsonwebtoken"
import { Auth } from "../models/login.model.js";


export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token = req.cookies?.accessToken ;

  if(!token){
    throw new ApiError(401,"Token is not available.")
  }

  const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY)

  if(!decodedToken){
    throw new ApiError(401,"Invalid token.")
  }

  const user = await Auth.findById(decodedToken.id).select("-password");

  if(!user){
    throw new ApiError(401,"Token Invalid or Expired.")
  }

  req.user = user;
  next();

})