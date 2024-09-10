import mongoose from "mongoose";
const { Schema } = mongoose;

const doctorSchema = new mongoose.Schema({
    name : String,
    councilID: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    
    avatar: {
        type: String,
    },
   
    adhaarNumber: {
        type: String,
        required: true,
        unique: true
      },
      identificationDocument: {
        type: Schema.Types.Mixed,
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
    qualification: {
        type: String,
        required: true,
    },
    clinicAddress: {
        type: String,
        required: true,
    }

})

const doctor = mongoose.model('doctor', doctorSchema) || mongoose.models.doctors;

export default doctor;