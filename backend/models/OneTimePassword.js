import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String, 
    ref: "User",
    required: true,
    index: true   
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 300 } // TTL index → 5 minutes
  }
});

// Ensure TTL index is created
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export default mongoose.model("OTP", otpSchema);
