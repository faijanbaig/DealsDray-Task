import { Schema,model } from "mongoose";
import { ApiError } from "../utils/ApiError.util.js";

const employeeSchema = new Schema(
  {
    name:{
      type:String,
      required:true,
      trim:true,
      maxlength:[50,"Name must be less than 50 characters"]
    },
    email:{
      type:String,
      required:true,
      trim:true,
      unique:true,
    },
    avatar:{
      type:String,
      unique:true
    },
    mobile:{
      type:Number,
      unique:true,
      required:true
    },
    designation:{
      type:String,
      required:true,
      enum:["HR","Manager","Sales"]
    },
    gender:{
      type:String,
      required:true,
      enum:["Male","Female"]
    },
    course:[
      {
        type:String,
        required:true,
        enum:["MCA","BCA","BSC"]
      }
    ],
    uniqueId:{
      type:Number,
      unique:true,
    }
  },
  {
    timestamps:true
  }
)

employeeSchema.pre("save", async function (next) {
  try {
    // Find the employee with the highest uniqueId
    if(!this.isNew){
      next();
    }
    const lastEmployee = await Employee.findOne().sort({ uniqueId: -1 }).select("uniqueId");

    // If no employees are found, set the default uniqueId to 1
    const maxUniqueId = lastEmployee ? lastEmployee.uniqueId : 0;

    // Assign the new uniqueId
    this.uniqueId = maxUniqueId + 1;

    next();
  } catch (error) {
    next(new ApiError(500, "Something went wrong while creating employee's unique ID."));
  }
});


export const Employee = model("Employee", employeeSchema)