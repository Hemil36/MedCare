import mongoose from "mongoose";

const Schema = mongoose.Schema;

const appointmentSchema = new mongoose.Schema({
    patientID: { type: String ,required: true },
    date: { type: Date, required: true },
    time: { type: String },
    notes: { type: String },
    doctorID : { type: String, required: true },
    status: { type: String, default: "pending" }
  });


const Appointment = mongoose.model('Appointment', appointmentSchema) || mongoose.models.Appointments;

export default Appointment;