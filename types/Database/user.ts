import { Document } from "mongoose";

export interface UserType extends Document{
    name:string,
    email:string,
    password:string,
    role:string,
    profilePhoto?: string | null; 
    otpForVerify?:string,
    otpForVerifyExpires?:Date,
    verifyOtp:boolean,
    isVerified:boolean,
    verifyFor:string,
    deviceToken:string,
    deviceType:string
}