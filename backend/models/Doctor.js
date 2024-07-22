import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name : String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    dateofbirth: {
        type: Date,
        required: true,
    },
    adhaarCard: {
        type: Number,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    doctorId :{
        type: String,
        required: true,
    },
    speciality: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    clinicAddress: {
        type: String,
        required: true,
    },

})

const doctor = mongoose.model('doctor', doctorSchema) || mongoose.models.doctors;

export default doctor;