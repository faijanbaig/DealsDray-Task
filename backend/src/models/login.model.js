import { Schema,model } from "mongoose"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const authSchema = new Schema({
  username:{
    type:String,
    required:true,
    trim:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:["admin","employee"],
    default:"admin"
  },
  refreshToken:{
    type:String
  },
  name:{
    type:String,
    required:true,
    trim:true
  }
},
{
  timestamps:true
});

authSchema.pre("save",async function(next){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,15);
  }
  next();
})

authSchema.methods.isPasswordCorrect = async function(password){
  return bcrypt.compare(password,this.password);
}

authSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      id:this.id,
      username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET_KEY, 
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

authSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      id:this.id
    },
    process.env.REFRESH_TOKEN_SECRET_KEY, 
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const Auth =  model("Auth",authSchema)