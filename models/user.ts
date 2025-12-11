import { model, Schema } from "mongoose";
import { UserType } from "../types/Database/user.js";
import { StringDecoder } from "string_decoder";

const userSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Customer", "Driver"],
      default: "Driver",
    },
    profilePhoto:{
      type:String
    },
    otpForVerify: {
      type:String,
    },
    otpForVerifyExpires: {
      type: Date,
    },
    verifyOtp: {
      type: Boolean,
    },
    isVerified:{
      type:Boolean
    },
    verifyFor:{
      type:String,
      enum:["forRegister","forForgetPassword"],
      default:"forRegister"
    },
    deviceToken:{
      type:String
    },
    deviceType:{
      type:String
    }
  },
  { timestamps: true }
);

export const User =  model<UserType>("user", userSchema);
 