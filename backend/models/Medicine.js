import mongoose, { Schema } from "mongoose";

const medicine = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    dose:{
        type:String,
        required:true
    },
    frequency:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    }
  });


export default medicine;
  