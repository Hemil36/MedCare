import mongoose from 'mongoose';
const { Schema } = mongoose;
import ImageSchema from "./ImageSchema.js"

const PatientSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone:{
    type: String,
    required: true,
    unique: true
  },
  birthDate: Date,
  gender: {
    type: String,
    enum: ["M", "F", "Other"],

  },
  patientID : {
    type: String,
    required: true,
    unique: true
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
    unique: true
  },
  identificationDocument: {
    type: Schema.Types.Mixed,
    required: true,
  
  },
});

const Patient = mongoose.model('Patient', PatientSchema) || mongoose.models.Patient;

export default Patient;
