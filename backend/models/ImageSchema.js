import mongoose, { Schema } from "mongoose";

const imageSchema = new mongoose.Schema({
  patientID: { type: Schema.Types.ObjectId, ref: "Patient", required: true }, 
  type: { type: String, required: true },
  data: { type: Buffer, required: true },
});

const Image = mongoose.model("Image", imageSchema) || mongoose.models.Image;
export default Image;
