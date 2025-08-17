import mongoose from 'mongoose';
const { Schema } = mongoose;

const PatientSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    birthDate: Date,
    gender: {
      type: String,
      enum: ["M", "F", "Other"],
    },
    patientID: {
      type: String,
      required: true,
      unique: true,
      index: true, // ✅ Index applied here
    },
    address: String,
    occupation: String,
    emergencyContactName: String,
    emergencyPhone: Number,
    insuranceProvider: String,
    insurancePolicyNumber: String,
    currentMedication: String,
    familyMedicalHistory: String,
    pastMedicalHistory: String,
    identificationType: String,
    adhaarNumber: {
      type: String,
      required: true,
      unique: true,
    },
    identificationDocument: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

PatientSchema.index({ patientID: 1 });

const Patient =
  mongoose.models.Patient || mongoose.model("Patient", PatientSchema);

export default Patient;
