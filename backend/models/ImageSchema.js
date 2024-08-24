import mongoose, { Schema } from "mongoose";

const imageSchema = new mongoose.Schema({
  patientID: {
    type : Schema.Types.String,
    ref : "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
});
const Schema1 =  mongoose.model("Image", imageSchema) || mongoose.models.Image;

export default Schema1;