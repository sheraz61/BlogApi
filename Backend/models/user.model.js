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
    },email:{
        type:String,
        unique:true
    }
})

export const User=mongoose.model('User',userSchema)