import mongoose from "mongoose";
import medicineSchema from "./Medicine.js";

const Schema = mongoose.Schema;

const appointmentSchema = new mongoose.Schema({
    patientID: { type: String ,required: true },
    date: { type: Date, required: true },
    time: { type: String },
    notes: { type: String },
    doctorID : { type: String, required: true },
    symptoms: { type: String },
    prescription: [medicineSchema],
    status: { type: String, default: "pending" , required: true},
    diagnosis: { type: String },
  });


const Appointment = mongoose.model('Appointment', appointmentSchema) || mongoose.models.Appointments;

export default Appointment;