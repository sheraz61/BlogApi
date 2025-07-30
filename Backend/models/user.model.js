import mongoose from "mongoose";

const userSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    resetPassword: {
        code: String,
        expiresAt: Date,
        attempts: { type: Number, default: 0 },
        lastAttemptAt: Date,
      },
    email:{
        type:String,
        unique:true
    },
    emailVerification: {
        code: String,
        expiresAt: Date,
        attempts: { type: Number, default: 0 },
        firstAttemptAt: Date,
      },
      unverifyEmail:{
        type:String
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },
      profileImage: {
        url: String,
        public_id: String,
      }
})

export const User=mongoose.model('User',userSchema)