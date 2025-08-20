import mongoose from "mongoose";
import medicineSchema from "./Medicine.js";

const Schema = mongoose.Schema;

const appointmentSchema = new mongoose.Schema({
    patientID: { type: Schema.Types.ObjectId, ref: "patient", required: true }, 
    doctorID: { type: Schema.Types.ObjectId, ref: "doctor", required: true },      
    date: { type: Date, required: true },
    time: { type: String },
    notes: { type: String },
    symptoms: { type: String },
    prescription: [medicineSchema],
    status: { type: String, default: "pending" , required: true},
    diagnosis: { type: String , default:" " , required: true},
  });


const Appointment = mongoose.model('Appointment', appointmentSchema) || mongoose.models.Appointments;

export default Appointment;